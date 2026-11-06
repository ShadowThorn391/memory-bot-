// ==UserScript==
// @name         MemoryBot (safe preview)
// @namespace    https://github.com/ShadowThorn391
// @version      0.2
// @description  Local-only transcript preview; network export disabled pending authenticated daemon and consent review
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

'use strict';

// Security invariant: this userscript never sends or automatically reads
// conversation transcripts. Previous automatic sessionStorage -> localhost
// POST behavior is intentionally disabled pending a separately reviewed,
// authenticated, explicit-consent protocol (issue #1).
// No DOM observer, network API, daemon invocation or installer is used.
function getProjectId(pathname) {
  const match = pathname.match(/(?:^|\/)projects\/([^/?#]+)(?:\/|$)/);
  return match ? match[1] : null;
}

// Expose only a non-sensitive project identifier to aid future opt-in UI.
// No transcript contents are accessed or persisted.
const projectId = getProjectId(location.pathname);
if (projectId) {
  console.info('MemoryBot safe preview: export disabled for this project.');
}
