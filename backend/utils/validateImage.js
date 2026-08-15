import fs from 'fs';

// Magic-byte signatures for the image types we accept — checked against the
// actual file content, not just the client-supplied mimetype/extension,
// since those are trivially spoofable.
const SIGNATURES = [
    { bytes: [0xff, 0xd8, 0xff] }, // jpeg
    { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }, // png
    { bytes: [0x47, 0x49, 0x46, 0x38] }, // gif (GIF8)
];

function matchesSignature(buffer) {
    return SIGNATURES.some(({ bytes }) =>
        bytes.every((byte, i) => buffer[i] === byte)
    );
}

// Middleware to run after multer: rejects uploads whose content doesn't
// match a known image signature, deleting the file multer already wrote.
export function verifyImageContent(req, res, next) {
    if (!req.file) return next();

    const fd = fs.openSync(req.file.path, 'r');
    const buffer = Buffer.alloc(8);
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    if (!matchesSignature(buffer)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Uploaded file is not a valid image' });
    }

    next();
}
