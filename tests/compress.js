const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

// Gets the assignment path from args[2]
if (!(args.length > 2)) {
    console.error("Assignment path not found");
    process.exit(1);
}
const orig = path.resolve(args[2]);

console.log(__dirname);
const dest = path.resolve(path.join(__dirname ,"../CORE19-08_quiz_express.zip"));
const output = fs.createWriteStream(orig);
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});
archive.pipe(output);
archive.glob('*', {"ignore": ['node_modules', 'tests', 'README.md', 'LICENSE']});
archive.finalize();
fs.moveSync(orig, dest, { overwrite: true });