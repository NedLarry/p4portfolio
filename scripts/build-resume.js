#!/usr/bin/env node
// Pre-parses the resume PDF in public/resumes into resume-data.json.
// Run this whenever a new resume PDF is uploaded/replaced in public/resumes.
// The server reads the generated JSON at request time instead of parsing
// the PDF on every visit.

const path = require('path');
const fs = require('fs');

const resumesDir = path.join(__dirname, '../public/resumes');
const outputFile = path.join(resumesDir, 'resume-data.json');

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

async function main() {
    const filename = fs.readdirSync(resumesDir).find(f => f.toLowerCase().endsWith('.pdf'));
    if (!filename) {
        console.error('No resume PDF found in', resumesDir);
        process.exit(1);
    }

    if (typeof globalThis.DOMMatrix === 'undefined') {
        globalThis.DOMMatrix = require('@thednp/dommatrix');
    }

    const { PDFParse } = require('pdf-parse');
    const fileBuffer = fs.readFileSync(path.join(resumesDir, filename));
    const parser = new PDFParse({ data: fileBuffer });
    const { pages } = await parser.getText();
    await parser.destroy();

    const text = pages.map(page => page.text).join('\n\n');
    const blocks = parseResumeBlocks(text);

    const data = {
        filename,
        url: `/resumes/${filename}`,
        generatedAt: new Date().toISOString(),
        blocks
    };

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log(`Wrote ${blocks.length} blocks to ${outputFile}`);
}

main().catch(e => {
    console.error('Failed to build resume data:', e);
    process.exit(1);
});
