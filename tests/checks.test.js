/**
 * Corrector para la práctica de sql
 */

// IMPORTS
const should = require('chai').should();
const path = require('path');
const fs = require('fs-extra');
const Utils = require('./utils');
const to = require('./to');
const child_process = require("child_process");
const spawn = require("child_process").spawn;
const Browser = require('zombie');

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_WAIT = 10; // Server launch time (seconds)
const T_TEST = 5 * 60; // Time between tests (seconds)
const path_assignment = path.resolve(path.join(__dirname, "../quiz_express"));
const path_json = path.join(path_assignment, 'package.json');
const quizzes_orig = path.join(path_assignment, 'quizzes.sqlite');
const quizzes_back = path.join(path_assignment, 'quizzes.original.sqlite');
const quizzes_test = path.join(__dirname, 'quizzes.sqlite');
const browser = new Browser();
const url = "http://localhost:3000";

// HELPERS
const timeout = ms => new Promise(res => setTimeout(res, ms));
let server = null;

//TESTS
describe("CORE19-08_quiz_express", function () {

    this.timeout(T_TEST * 1000);

    it('', async function () {
        this.name = `1(Precheck): Checking that the assignment directory exists...`;
        this.score = 0;
        this.msg_ok = `Found the directory '${path_assignment}'`;
        this.msg_err = `Couldn't find the directory '${path_assignment}'`;
        const [error_path, path_ok] = await to(fs.pathExists(path_assignment));
        if (error_path) {
            error_critical = this.msg_err;
        }
        path_ok.should.be.equal(true);
    });

    it('', async function () {
        this.name = `2(Precheck): Checking that the 'package.json' file exists...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "'package.json' file found";
            this.msg_err = `Error: 'package.json' file not found at ${path_json}`;
            const [json_nok, json_ok] = await to(fs.pathExists(path_json));
            if (json_nok || !json_ok) {
                this.msg_err = `The file '${path_json}' has not been found`;
                error_critical = this.msg_err;
            }
            json_ok.should.be.equal(true);
        }});

    it('', async function () {
        this.name = `3(Precheck): Checking the 'package.json' file format...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "The 'package.json' file has the right format";
            this.msg_err = `Error: parsing the 'package.json' file at ${path_json}`;
            const [error_json, contenido] = await to(fs.readFile(path_json, 'utf8'));
            if (error_json) {
                this.msg_err = `The file '${path_json}' doesn't have the right format`;
                error_critical = this.msg_err;
            }
            should.not.exist(error_critical);
            const is_json = Utils.isJSON(contenido);
            if (!is_json) {
                error_critical = this.msg_err;
            }
            should.not.exist(error_critical);
        }});

    it('', async function () {
        const expected = "npm install";
        this.name = `4(Precheck): Installing dependencies...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Dependencies installed successfully";
            this.msg_err = "Error installing dependencies";
            //install dependencies
            [error_deps, output] = await to(new Promise((resolve, reject) => {
                child_process.exec(expected, {cwd: path_assignment}, (err, stdout) =>
                    err ? reject(err) : resolve(stdout))
            }));
            if (error_deps) {
                this.msg_err = "Error installing dependencies: " + error_deps;
                error_critical = this.msg_err;
            }
            should.not.exist(error_critical);
        }
    });

    it('', async function () {
        this.name = `5(Precheck): Replacing answers file...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "'quizzes.sqlite' replaced successfully";
            this.msg_err = "Error replacing 'quizzes.sqlite'";
            let error_deps;
            try {fs.copySync(quizzes_orig, quizzes_back, {"overwrite": true});} catch (e){}
            [error_deps, _] = await to(fs.copy(quizzes_test, quizzes_orig, {"overwrite": true}));
            if (error_deps) {
                this.msg_err = "Error copying the answers file: " + error_deps;
            }
            should.not.exist(error_deps);
        }
    });

    it('', async function () {
        this.name = `6: Launching the server...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `'The server has been launched correctly`;
            this.msg_err = `Error running 'node bin/www'`;
            server = spawn("node", ["bin/www"], {cwd: path_assignment});
            let error_launch = "";
            server.on('error', function (data) {
                error_launch += data
            });
            await to(timeout(T_WAIT * 1000));
            this.msg_err = `Error running 'node bin/www'\n\t\t\tReceived: ${error_launch}`;
            if (error_launch.length) {
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            error_launch.should.be.equal("");
        }
        });

    it('', async function () {
        const expected = url;
        this.name = `7: Checking that the server responds at ${expected}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Server responded at ${expected}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(expected));
            if (error_nav) {
                this.msg_err = `Server not responding at ${expected}\nError:${error_nav}\nReceived:${browser.text('body')}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            should.not.exist(error_nav);
        }
    });

    it('', async function () {
        const expected = /credits/img;
        this.name = `8: Checking that the server shows '${expected}' at ${url}...`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
           this.msg_ok = `Found ${expected} at ${url}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            if (error_nav) {
                this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            this.msg_ok = `'${expected}' not found at ${url}\n\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it('', async function () {
        const expected = /quizzes/img;
        this.name = `9: Checking that the server shows '${expected}' at ${url}...`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Found ${expected} at ${url}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            if (error_nav) {
                this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            this.msg_ok = `'${expected}' not found at ${url}\n\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it('', async function () {
        const expected = url + "/credits";
        this.name = `10: Checking that the server responds at ${expected}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Server responded at ${expected}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(expected));
            if (error_nav) {
                this.msg_err = `Server not responding at ${url}\nError:${error_nav}\nReceived:${browser.text('body')}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            should.not.exist(error_nav);
        }
    });

    it('', async function () {
        const expected = url + "/quizzes";
        this.name = `11: Checking that the server responds at ${expected}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Server responded at ${expected}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(expected));
            if (error_nav) {
                this.msg_err = `Server not responding at ${url}\nError:${error_nav}\nReceived:${browser.text('body')}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            should.not.exist(error_nav);
        }
    });

    it('', async function () {
        const expected = "Question Number 1";
        this.name = `12: Checking that the server shows the questions at ${url+"/quizzes"}...`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Found '${expected}' at ${url+"/quizzes"}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url+"/quizzes"));
            if (error_nav) {
                this.msg_err = `Server not responding at ${url+"/quizzes"}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            this.msg_ok = `'${expected}' not found at ${url}\n\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    after("Restoring the original file", async function () {
        if (server) {
            server.kill();
            await timeout(T_WAIT * 1000);
        }
        try {fs.copySync(quizzes_back, quizzes_orig, {"overwrite": true});} catch (e){}
    });

});