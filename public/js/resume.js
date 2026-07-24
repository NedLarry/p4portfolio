const statusEl = document.getElementById('resume-status');
const dumpEl = document.getElementById('resume-dump');
const downloadEl = document.getElementById('resume-download');

const BULLET_PATTERN = /^[●•▪‣∙\-\*]\s+/;
const LABELED_LINE_PATTERN = /^[A-Za-z][A-Za-z &]{1,30}:\s/;

function isHeaderLine(line) {
    const letters = line.replace(/[^A-Za-z]/g, '');
    return letters.length > 1 && letters === letters.toUpperCase() && line.length <= 40;
}

function isBulletLine(line) {
    return BULLET_PATTERN.test(line);
}

function isLabeledLine(line) {
    return LABELED_LINE_PATTERN.test(line);
}

function isPipelineLine(line) {
    return line.includes(' | ');
}

function parseResumeBlocks(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const blocks = [];
    let paragraphBuffer = [];

    const flushParagraph = () => {
        if (paragraphBuffer.length) {
            blocks.push({ type: 'paragraph', text: paragraphBuffer.join(' ') });
            paragraphBuffer = [];
        }
    };

    for (const line of lines) {
        if (isHeaderLine(line)) {
            flushParagraph();
            blocks.push({ type: 'header', text: line });
        } else if (isBulletLine(line)) {
            flushParagraph();
            blocks.push({ type: 'bullet', text: line.replace(BULLET_PATTERN, '') });
        } else if (isLabeledLine(line)) {
            flushParagraph();
            blocks.push({ type: 'labeled', text: line });
        } else if (isPipelineLine(line)) {
            flushParagraph();
            blocks.push({ type: 'pipeline', text: line });
        } else {
            const previous = blocks[blocks.length - 1];
            if (previous && previous.type === 'bullet') {
                previous.text += ' ' + line;
            } else {
                paragraphBuffer.push(line);
            }
        }
    }
    flushParagraph();

    return blocks;
}

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

        renderResumeBlocks(parseResumeBlocks(data.text));
        dumpEl.hidden = false;
        statusEl.hidden = true;

        downloadEl.href = data.url;
        downloadEl.hidden = false;
    })
    .catch(error => {
        console.error('Error:', error);
        statusEl.textContent = 'No resume is currently available.';
        statusEl.classList.add('error');
    });
