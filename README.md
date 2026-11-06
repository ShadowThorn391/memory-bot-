# MemoryBot — security review hold

This repository contains a browser userscript and a Windows installer. **The default branch still contains the legacy automatic-export userscript and unreviewed remote-code installer. Do not install or execute them.**

Draft [PR #2](https://github.com/ShadowThorn391/memory-bot-/pull/2) disables automatic transcript reads/network export and replaces the installer with an intentional fail-closed stub. This is a containment change, **not** a working authenticated transcript-export product.

## Safe verification (no installation)

- Inspect `userscript/memorybot.user.js`: no `GM_xmlhttpRequest`, `fetch`, `sessionStorage` transcript access, `MutationObserver`, or automatic network export.
- Inspect `install.ps1`: it must fail before any Chocolatey/bootstrap download, Git clone, package installation, or daemon start.
- Require independent review of code and tests before merging; do not execute a userscript or daemon using live chats during validation.
- No Actions workflow exists in this repository as of the November 6 inspection. Static source inspection is **not** browser, PowerShell, or daemon execution testing.

## Re-enabling export (future separate review)

Issue [#1](https://github.com/ShadowThorn391/memory-bot-/issues/1) remains open until there is explicit per-project user consent with exact payload preview, redaction and size limits, an authenticated origin-restricted daemon with impersonation tests, pinned and hash-verified install inputs, adversarial tests, and actual clean-environment execution evidence. Never assume ChatGPT DOM or storage internals are stable or authorize collection of family/private records.
