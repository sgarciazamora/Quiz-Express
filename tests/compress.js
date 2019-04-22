const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const base = path.resolve(path.join(__dirname, "../"));
const orig = path.join(base, "quiz_express");
const dest = path.join(base ,"CORE19-08_quiz_express.zip");
const output = fs.createWriteStream(dest);
const archive = archiver('zip', {zlib: { level: 9 } /* Sets the compression level.*/});

archive.pipe(output);
archive.glob(`**`, {"cwd": orig, "ignore": ["node_modules/**"]});
archive.finalize();

