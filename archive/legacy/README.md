# Legacy / Unused Code Archive

This folder contains code that appears to be **unused or duplicated** in the current app build (as of 2026-02-05). It was moved here to keep the active codebase lean and easier to navigate.

## Why it was moved
- The modules were not referenced by any local imports in `src/`.
- Many of them were legacy versions (e.g. non-`-v2` section variants) or UI components not currently used.
- Keeping them in the active tree made maintenance harder and increased noise when searching.

## How to restore something
1. Copy the file back to the original path under `src/`.
2. Update any import paths as needed.
3. Rebuild to confirm the module is picked up.

## Notes
- This archive is intentionally **not** referenced by the app. Nothing here is bundled by Vite unless re-imported.
- If you plan to permanently delete this code later, do so after a production release confirms it is no longer needed.
