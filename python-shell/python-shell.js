module.exports = function (RED) {
    const tmpdir = require("os").tmpdir();
    const sep = require("path").sep;
    const fs = require("fs");
    const { PythonShell } = require("python-shell");

    function PythonCode(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.python = config.python;

        let node = this;
        node.on("input", function (msg) {
            executePython(node, msg, false);
        });
    }
    RED.nodes.registerType("python-code", PythonCode);

    function PythonFile(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.python = config.python;

        let node = this;
        node.on("input", function (msg) {
            executePython(node, msg, true);
        });
    }
    RED.nodes.registerType("python-file", PythonFile);

    function executePython(node, msg, file) {
        const options = {
            pythonPath: "python3",
            pythonOptions: ["-u"],
            args: [msg.payload],
        };

        let filePath;
        let shell;

        try{
            if (file) {
                filePath = node.python;
            } else {
                filePath = tmpdir + sep + getFilename();
                fs.writeFileSync(filePath, node.python);
            }
        } catch (err) {
            node.error(err, msg);
            node.log(`${node.type}.executePython Error: ${err.message}`);
            return;
        }

        try{
            shell = new PythonShell(filePath, options);
        } catch (err) {
            node.error(err, msg);
            node.log(`${node.type}.executePython Error: ${err.message}`);
            return;
        }

        let output = [];
        let logs = [];
        let stdoutBuffer = "";

        shell.stdout.on("data", function (chunk) {
            const lines = (stdoutBuffer + chunk).split(/\r?\n/);
            stdoutBuffer = lines.pop();
            output.push(...lines);
        });

        shell.on("stderr", function (stderr) {
            logs.push(stderr);
        });

        shell.end(function (err, code, signal) {
            if (stdoutBuffer !== "") {
                output.push(stdoutBuffer);
            }

            if (code != 0) {
                node.error(err, msg);
                node.log(`${node.type}.executePython Error: ${err.message}`);
            } else {
                let msg1 = {
                    _msgid : msg._msgid,
                    payload : output
                }
                let msg2 = {
                    _msgid : msg._msgid,
                    payload : logs
                }
                node.log("send stdout:"+JSON.stringify(msg1));
                node.log("send stderr:"+JSON.stringify(msg2));
                node.send([msg1, msg2]);
            }

            if (!file) {
                fs.unlinkSync(filePath);
            }
        });
    }

    function getFilename() {
        return `pythonShellFile${Math.floor(Math.random() * 10000000000)}.py`;
    }
};
