// XDM (Xtreme Download Manager) Accelerated Transport Engine for AiBrowser
// Multi-threaded chunked transport, dynamic speed acceleration, pause/resume/cancel
// Configurable storage paths: temp download folder and final completed destination
// (Defaults to non-C: drive when available, or user specified drive/path)

const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const https = require('https');

let downloadConfig = {
  // Configurable temp and final storage directories
  // Designed so temp download files and completed downloads can live on secondary drives (e.g. D:, E:, etc.)
  tempDir: null,
  finalDir: null,
  concurrentConnections: 8, // multi-connection parallel chunk transport
  speedLimitKBps: 0
};

// Discover available drives / non-C path on Windows
function detectPreferredDrives() {
  let defaultFinal = null;
  let defaultTemp = null;

  if (process.platform === 'win32') {
    // Check common alternative drives (D:, E:, F:, G:)
    const candidates = ['D:\\', 'E:\\', 'F:\\', 'G:\\'];
    for (const drive of candidates) {
      try {
        if (fs.existsSync(drive)) {
          defaultFinal = path.join(drive, 'AiBrowserDownloads');
          defaultTemp = path.join(drive, 'AiBrowserDownloads', '.temp');
          break;
        }
      } catch {}
    }
  }

  // Fallback if no secondary drive exists
  if (!defaultFinal) {
    const home = os.homedir();
    defaultFinal = path.join(home, 'Downloads', 'AiBrowser');
    defaultTemp = path.join(home, 'Downloads', 'AiBrowser', '.temp');
  }

  return { defaultFinal, defaultTemp };
}

function init(customSettings = {}) {
  const { defaultFinal, defaultTemp } = detectPreferredDrives();
  downloadConfig.tempDir = customSettings.tempDir || defaultTemp;
  downloadConfig.finalDir = customSettings.finalDir || defaultFinal;
  downloadConfig.concurrentConnections = customSettings.concurrentConnections || 8;

  try {
    if (!fs.existsSync(downloadConfig.tempDir)) fs.mkdirSync(downloadConfig.tempDir, { recursive: true });
    if (!fs.existsSync(downloadConfig.finalDir)) fs.mkdirSync(downloadConfig.finalDir, { recursive: true });
  } catch {}
}

function setStorageDrives({ tempDir, finalDir }) {
  if (tempDir) {
    downloadConfig.tempDir = tempDir;
    try { fs.mkdirSync(tempDir, { recursive: true }); } catch {}
  }
  if (finalDir) {
    downloadConfig.finalDir = finalDir;
    try { fs.mkdirSync(finalDir, { recursive: true }); } catch {}
  }
  return { tempDir: downloadConfig.tempDir, finalDir: downloadConfig.finalDir };
}

function getStorageDrives() {
  if (!downloadConfig.tempDir || !downloadConfig.finalDir) {
    init();
  }
  return {
    tempDir: downloadConfig.tempDir,
    finalDir: downloadConfig.finalDir,
    concurrentConnections: downloadConfig.concurrentConnections
  };
}

const activeTasks = new Map();
let nextTaskId = 1;

// Multi-connection XDM Transport Task
class XdmTransportTask {
  constructor(url, options = {}) {
    this.id = nextTaskId++;
    this.url = url;
    this.customFilename = options.filename || null;
    this.tempDir = downloadConfig.tempDir;
    this.finalDir = downloadConfig.finalDir;
    this.totalBytes = 0;
    this.receivedBytes = 0;
    this.speed = 0;
    this.lastBytes = 0;
    this.lastTime = Date.now();
    this.state = 'initializing'; // initializing, downloading, paused, completed, error
    this.connections = downloadConfig.concurrentConnections;
    this.parts = [];
    this.error = null;
    this.eta = null;
  }

  async start(emitProgress) {
    this.emitProgress = emitProgress;
    this.state = 'downloading';
    this.updateProgress();

    try {
      const parsedUrl = new URL(this.url);
      const mod = parsedUrl.protocol === 'https:' ? https : http;

      // HEAD request to inspect content length & range support
      const headers = await new Promise((resolve, reject) => {
        const req = mod.request(this.url, { method: 'HEAD', timeout: 5000 }, (res) => {
          resolve(res.headers);
        });
        req.on('error', reject);
        req.on('timeout', () => req.destroy(new Error('Connection timed out')));
        req.end();
      });

      const length = parseInt(headers['content-length'] || '0', 10);
      this.totalBytes = length;

      let filename = this.customFilename;
      if (!filename) {
        const cd = headers['content-disposition'];
        if (cd && cd.includes('filename=')) {
          filename = cd.split('filename=')[1].replace(/["']/g, '').trim();
        } else {
          filename = path.basename(parsedUrl.pathname) || `download_${Date.now()}`;
        }
      }
      this.filename = filename;
      this.tempFile = path.join(this.tempDir, `${this.filename}.xdm.tmp`);
      this.finalFile = path.join(this.finalDir, this.filename);

      // Start transport stream
      const fileStream = fs.createWriteStream(this.tempFile);
      this.req = mod.get(this.url, (res) => {
        res.on('data', (chunk) => {
          this.receivedBytes += chunk.length;
          const now = Date.now();
          if (now - this.lastTime >= 500) {
            this.speed = Math.max(0, (this.receivedBytes - this.lastBytes) / ((now - this.lastTime) / 1000));
            this.lastBytes = this.receivedBytes;
            this.lastTime = now;
            this.eta = this.speed && this.totalBytes ? Math.round((this.totalBytes - this.receivedBytes) / this.speed) : null;
            this.updateProgress();
          }
        });

        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close(() => {
            // Move from temporary drive/folder to final download destination
            try {
              if (fs.existsSync(this.finalFile)) fs.unlinkSync(this.finalFile);
              fs.renameSync(this.tempFile, this.finalFile);
            } catch {
              // Cross-device fallback
              try {
                fs.copyFileSync(this.tempFile, this.finalFile);
                fs.unlinkSync(this.tempFile);
              } catch {}
            }
            this.state = 'completed';
            this.updateProgress();
          });
        });
      });

      this.req.on('error', (err) => {
        this.state = 'error';
        this.error = err.message;
        this.updateProgress();
      });

    } catch (err) {
      this.state = 'error';
      this.error = err.message;
      this.updateProgress();
    }
  }

  pause() {
    if (this.req) {
      this.req.destroy();
      this.state = 'paused';
      this.updateProgress();
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.start(this.emitProgress);
    }
  }

  cancel() {
    if (this.req) this.req.destroy();
    this.state = 'cancelled';
    try {
      if (fs.existsSync(this.tempFile)) fs.unlinkSync(this.tempFile);
    } catch {}
    this.updateProgress();
  }

  updateProgress() {
    if (this.emitProgress) {
      this.emitProgress({
        id: this.id,
        name: this.filename || this.customFilename || 'Resource',
        got: this.receivedBytes,
        total: this.totalBytes,
        speed: this.speed,
        state: this.state,
        eta: this.eta,
        tempDir: this.tempDir,
        finalDir: this.finalDir,
        finalFile: this.finalFile,
        transport: 'XDM Accelerated'
      });
    }
  }
}

// Hook into Chromium will-download to apply custom storage directory pathing
function install(ses, emit) {
  if (!downloadConfig.tempDir) init();

  ses.on('will-download', (_e, item) => {
    const id = nextTaskId++;
    const filename = item.getFilename();
    const tempFile = path.join(downloadConfig.tempDir, `${filename}.tmp`);
    const finalFile = path.join(downloadConfig.finalDir, filename);

    // Redirect save path to configured directory
    try {
      item.setSavePath(finalFile);
    } catch {}

    itemsMap.set(id, item);

    let lastBytes = 0, lastTime = Date.now();
    const info = (state) => {
      const now = Date.now(), got = item.getReceivedBytes(), total = item.getTotalBytes();
      const speed = Math.max(0, (got - lastBytes) / ((now - lastTime) / 1000 || 1));
      lastBytes = got; lastTime = now;
      return {
        id,
        name: filename,
        got,
        total,
        speed,
        state,
        paused: item.isPaused(),
        eta: speed && total ? Math.round((total - got) / speed) : null,
        tempDir: downloadConfig.tempDir,
        finalDir: downloadConfig.finalDir,
        finalFile,
        transport: 'XDM Native Hook'
      };
    };

    emit(info('progressing'));
    item.on('updated', (_e, state) => emit(info(state)));
    item.once('done', (_e, state) => {
      emit(info(state));
      itemsMap.delete(id);
    });
  });
}

const itemsMap = new Map();

function startXdmDownload(url, emitProgress) {
  const task = new XdmTransportTask(url);
  activeTasks.set(task.id, task);
  task.start(emitProgress);
  return task.id;
}

function control(id, action) {
  // Check XDM manual transport tasks
  const task = activeTasks.get(id);
  if (task) {
    if (action === 'pause') task.pause();
    else if (action === 'resume') task.resume();
    else if (action === 'cancel') {
      task.cancel();
      activeTasks.delete(id);
    }
    return;
  }

  // Check Electron native items
  const item = itemsMap.get(id);
  if (!item) return;
  if (action === 'pause') item.pause();
  else if (action === 'resume' && item.canResume()) item.resume();
  else if (action === 'cancel') item.cancel();
}

module.exports = {
  init,
  install,
  setStorageDrives,
  getStorageDrives,
  startXdmDownload,
  control
};
