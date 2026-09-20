'use strict';

/*
 * Export the VMProtect study post as a single self-contained HTML file.
 * Run `npm run build` first, then `npm run export`.
 */
const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'public');
const entry = path.join(folder, 'inside-the-vm', 'index.html');
const out = path.join(__dirname, 'VMProtect_Study_Guide.html');

if (!fs.existsSync(entry)) {
    console.error('Study post not found at ' + entry + '\nRun `npm run build` first.');
    process.exit(1);
}

const localFile = (url) => {
    if (!url.startsWith('/') || url.startsWith('//')) return null;
    const file = path.join(folder, url.replace(/^\//, ''));
    return fs.existsSync(file) ? file : null;
};

let page = fs.readFileSync(entry, 'utf8');

page = page.replace(/<link rel="stylesheet" href="([^"]+)">/g, (match, url) => {
    const file = localFile(url);
    return file ? '<style>' + fs.readFileSync(file, 'utf8') + '</style>' : match;
});

page = page.replace(/<script src="([^"]+)"><\/script>/g, (match, url) => {
    const file = localFile(url);
    return file ? '<script>' + fs.readFileSync(file, 'utf8') + '</script>' : match;
});

const imagesDir = path.join(folder, 'images');
if (fs.existsSync(imagesDir)) {
    const mime = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
    };
    for (const name of fs.readdirSync(imagesDir)) {
        const ext = path.extname(name).toLowerCase();
        if (!mime[ext]) continue;
        const data = 'data:' + mime[ext] + ';base64,' + fs.readFileSync(path.join(imagesDir, name)).toString('base64');
        const pattern = new RegExp('src="/images/' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"', 'g');
        page = page.replace(pattern, 'src="' + data + '"');
    }
}

fs.writeFileSync(out, page);
console.log('Exported standalone ' + out);
