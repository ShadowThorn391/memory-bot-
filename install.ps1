# MemoryBot local setup (Windows) — fail-closed review stub.
# This public repository does not contain an audited, authenticated daemon.
# No external code is downloaded, installed or executed by this script.
# A future installation flow must pin dependency versions and SHA-256 hashes,
# require separate user approval, and pass the security gates in issue #1.
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Warning 'MemoryBot installation is disabled pending reviewed, pinned dependencies, an authenticated local daemon, and explicit per-project transcript consent. See issue #1.'
throw 'MEMORYBOT_INSTALL_BLOCKED: unreviewed remote code execution is prohibited.'
