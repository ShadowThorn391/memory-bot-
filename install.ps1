# install.ps1 – quick local setup for MemoryBot (Windows)
param()

Write-Host "== MemoryBot installer ==" -ForegroundColor Cyan

# 1. Ensure Chocolatey (for Node & Python if missing)
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
  Set-ExecutionPolicy Bypass -Scope Process -Force
  [System.Net.ServicePointManager]::SecurityProtocol = 3072
  iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}

# 2. Install Node LTS & Python 3.12 if not present
choco install -y nodejs-lts python --no-progress
$env:Path += ";$([System.Environment]::GetEnvironmentVariable('ProgramData'))\chocolatey\bin"

# 3. Clone daemon if not present
if (-not (Test-Path "$PSScriptRoot\\daemon")) {
  git clone https://github.com/erich-memory/auto-chatgpt-memory-daemon.git "$PSScriptRoot\daemon"
}

# 4. Install daemon deps & start
Push-Location "$PSScriptRoot\daemon"
  npm install --silent
  node index.js &
Pop-Location

Write-Host "✔ Daemon running on http://localhost:31337" -ForegroundColor Green
