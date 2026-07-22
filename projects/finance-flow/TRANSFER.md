# Finance Flow — Private Transfer: MacBook Pro → Mac Mini

Goal: move the Finance Flow app from the MacBook Pro (where it was built in Claude Desktop) to the Mac Mini, entirely over local Wi-Fi. Nothing touches the internet, GitHub, or Telegram. Everything below runs on your two Macs — encrypted end-to-end via SSH.

---

## Recommended: rsync over SSH

Best fit for a code folder: encrypted, repeatable (re-run it any time to sync updates), and it skips junk like `node_modules`.

### One-time setup on the Mac Mini

1. Create the dedicated account first (per your deployment checklist) — e.g. `financeflow`.
2. Enable SSH: **System Settings → General → Sharing → Remote Login** → ON.
   - Under "Allow access for", restrict to **only** the `financeflow` user.
3. Note the Mini's local name: run `hostname` in Terminal — typically something like `mac-mini.local`.

### Transfer from the MacBook Pro

Run in Terminal on the MacBook (adjust the two paths at the top):

```bash
SRC="$HOME/path/to/finance-flow/"        # trailing slash matters
DEST="financeflow@mac-mini.local:~/finance-flow/"

rsync -av --progress \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'dist' \
  --exclude '.DS_Store' \
  "$SRC" "$DEST"
```

- First run prompts for the `financeflow` account password, then copies everything.
- **Re-run the same command any time** — it only sends what changed.
- Adjust excludes to the app's stack (drop `.next`/`dist` if not applicable; add `venv/` for Python, etc.). Deliberately **not** excluded: the app's data files — the Mini is their new home, and the copy is SSH-encrypted on your LAN.

### After the transfer, on the Mac Mini

```bash
cd ~/finance-flow
# reinstall dependencies for this machine, e.g.:
npm install        # or: pip install -r requirements.txt
# then start the app and verify it works locally
```

Then continue the checklist in `README.md`: Tailscale access, share with Marissa.

---

## Alternative: AirDrop (one-shot, zero setup)

Fine if you just want it over once and will not re-sync:

1. On the MacBook: right-click the finance-flow folder → **Compress** (delete `node_modules` first to keep it small).
2. AirDrop the `.zip` to the Mac Mini (both logged in, Wi-Fi + Bluetooth on).
3. Unzip on the Mini, `npm install` (or equivalent), run.

AirDrop is peer-to-peer and encrypted; it does not route through Apple's servers.

---

## What NOT to use

- ~~`python3 -m http.server`~~ / any plain-HTTP "expose" — unencrypted on the LAN; wrong tool for financial content.
- ~~GitHub / iCloud / Drive~~ — you've ruled out cloud transit for this project.
- ~~Telegram~~ — hard rule, no exceptions.

## Privacy properties of the rsync path

| Property | Status |
|----------|--------|
| Leaves your LAN | Never |
| Encryption in transit | SSH (AES) |
| Third-party servers involved | None |
| Repeatable for future updates | Yes — same command |
| Access scope on the Mini | Only the `financeflow` account, only while Remote Login is on |

Optional hardening: turn Remote Login **off** on the Mini after the transfer is done, and re-enable only when you need to sync again.
