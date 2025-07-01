// ==UserScript==
// @name         MemoryBot
// @namespace    https://github.com/ShadowThorn391
// @version      0.1
// @description  Auto‑inject + auto‑save ChatGPT Project memory
// @match        https://chat.openai.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

const AUTO_COOKIE = true; // set true ➜ auto-refresh cookie
const DAEMON = 'http://localhost:31337';

function getProjectId() {
  const m = location.pathname.match(/projects\/(.+?)(\/|$)/);
  return m ? m[1] : null;
}

async function pushTranscript(projectId, messages) {
  GM_xmlhttpRequest({
    method: 'POST', url: `${DAEMON}/extract`, data: JSON.stringify({ project: projectId, messages }), headers:{'Content-Type':'application/json'}
  });
}

// Observe new assistant messages
const observer = new MutationObserver(muts => {
  muts.forEach(m => {
    if (m.addedNodes.length) {
      const roles = [...m.addedNodes].map(n=>n.querySelector('[data-message-author-role]'));
      if (roles.some(r=>r?.dataset.messageAuthorRole==='assistant')) {
        const proj = getProjectId();
        const msgs = JSON.parse(sessionStorage.getItem('chat_messages')||'[]');
        pushTranscript(proj,msgs);
      }
    }
  });
});
observer.observe(document.body,{childList:true,subtree:true});
