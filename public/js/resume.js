const statusEl = document.getElementById('resume-status');
const dumpEl = document.getElementById('resume-dump');
const downloadEl = document.getElementById('resume-download');

function renderResumeBlocks(blocks) {
    dumpEl.innerHTML = '';
    blocks.forEach(block => {
        const line = document.createElement('p');
        line.className = `resume-line resume-line--${block.type}`;
        line.textContent = block.type === 'bullet' ? `• ${block.text}` : block.text;
        dumpEl.appendChild(line);
    });
}

fetch('/api/resume')
    .then(response => response.json().then(data => ({ ok: response.ok, data })))
    .then(({ ok, data }) => {
        if (!ok) {
            throw new Error(data.error || 'Failed to load resume');
        }

        renderResumeBlocks(data.blocks);
        dumpEl.hidden = false;
        statusEl.hidden = true;

        downloadEl.href = '/api/resume/download';
        downloadEl.setAttribute('download', data.filename);
        downloadEl.hidden = false;
    })
    .catch(error => {
        console.error('Error:', error);
        statusEl.textContent = 'No resume is currently available.';
        statusEl.classList.add('error');
    });
