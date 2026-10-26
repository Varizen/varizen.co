# STFL AIO — Repository Archive Candidates Register

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-ARCHIVE-V2`  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.

---

## 1. Archive Candidates Catalog

| File / Folder Path | Size | Category | Safe Action in Pass 2 | Justification |
| :--- | :--- | :--- | :--- | :--- |
| `stfl.zip` (Root) | 1.61 GB | Backup Zip | Move to Cold Storage Archive | Redundant root zip backup. Source exists in Git tree. |
| `files/web/aakutu-board.zip` | 500.56 MB | Packaged Artifact | Move to Cold Storage Archive | Packaged Electron binaries for historical keyboard app. |
| `files/web/aakutu-board/release/` | 338.00 MB | Binary Executables | Prune from Git Working Tree | Unpacked Windows .exe and .dll distribution files. |
| `_old/` | 1.2 MB | Deprecated Prototype | Move to Archive Branch | Obsolete prototype landing page superseded by `apk/web`. |
