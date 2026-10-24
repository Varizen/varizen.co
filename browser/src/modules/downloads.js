// Eye Download: queue, progress, speed, ETA, pause/resume/cancel (Chromium resumable downloads).
const items = new Map();
let nextId = 1;

function install(ses, emit) {
  ses.on('will-download', (_e, item) => {
    const id = nextId++;
    items.set(id, item);
    let lastBytes = 0, lastTime = Date.now();
    const info = (state) => {
      const now = Date.now(), got = item.getReceivedBytes(), total = item.getTotalBytes();
      const speed = Math.max(0, (got - lastBytes) / ((now - lastTime) / 1000 || 1));
      lastBytes = got; lastTime = now;
      return {
        id, name: item.getFilename(), got, total, speed, state,
        paused: item.isPaused(), eta: speed && total ? Math.round((total - got) / speed) : null
      };
    };
    emit(info('progressing'));
    item.on('updated', (_e, state) => emit(info(state)));
    item.once('done', (_e, state) => { emit(info(state)); items.delete(id); });
  });
}

function control(id, action) {
  const item = items.get(id);
  if (!item) return;
  if (action === 'pause') item.pause();
  else if (action === 'resume' && item.canResume()) item.resume();
  else if (action === 'cancel') item.cancel();
}

module.exports = { install, control };
