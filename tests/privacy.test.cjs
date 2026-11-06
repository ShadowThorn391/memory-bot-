// Run with: node --test tests/privacy.test.cjs
// Offline, hermetic fail-closed checks: no transcripts, network or browser needed.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'userscript/memorybot.user.js'), 'utf8');
const installer = fs.readFileSync(path.join(root, 'install.ps1'), 'utf8');
const metadata = script.split('// ==/UserScript==')[0];

test('userscript asks for no elevated network privileges', () => {
  assert.match(metadata, /@grant\s+none\b/);
  assert.doesNotMatch(metadata, /@connect\b|GM_xmlhttpRequest|GM\.xmlHttpRequest/);
});
test('userscript contains no legacy automatic collection or network calls', () => {
  assert.doesNotMatch(script, /sessionStorage|localStorage|MutationObserver|XMLHttpRequest|sendBeacon|\bfetch\s*\(|WebSocket|\bimport\s*\(/);
  assert.doesNotMatch(script, /https?:\/\/localhost|127\.0\.0\.1|\/extract\b|chat_messages/);
});
test('project and non-project paths remain silent and offline', () => {
  for (const pathname of ['/projects/example-123', '/c/a-chat', '/projects/', '/']) {
    const calls = [];
    const context = {
      location: { pathname },
      console: { info: (...args) => calls.push(args) },
      fetch: () => { throw Error('network fetch attempted'); },
      XMLHttpRequest: class { constructor() { throw Error('XHR attempted'); } },
      MutationObserver: class { constructor() { throw Error('observer attempted'); } },
      sessionStorage: { getItem: () => { throw Error('storage read attempted'); } },
      document: { get body() { throw Error('DOM read attempted'); } }
    };
    vm.runInNewContext(script, context, { timeout: 1000 });
    assert.equal(calls.length, pathname === '/projects/example-123' ? 1 : 0);
    if (calls.length) assert.doesNotMatch(JSON.stringify(calls), /example-123/);
  }
});
test('Windows installer is a deny-by-default stub with no remote execution', () => {
  assert.match(installer, /MEMORYBOT_INSTALL_BLOCKED/);
  assert.match(installer, /\bthrow\s+/);
  assert.doesNotMatch(installer, /\b(?:iex|Invoke-Expression|Invoke-WebRequest|Start-Process|Invoke-RestMethod|git\s+clone|choco\s+install|npm\s+install|node\s+index\.js|DownloadString|Set-ExecutionPolicy)\b/i);
});
