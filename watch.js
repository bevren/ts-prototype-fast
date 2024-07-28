const spawn = require("child_process").spawn
const { WebSocketServer } = require("ws");
const { watchFile } = require("fs");
const path = require("path");



function cmd(program, args) {
    const spawnOptions = { "shell": true };
    console.log("CMD:", program, args.flat(), spawnOptions);
    const p = spawn(program, args.flat(), spawnOptions);

    p.stdout.on('data', (data) => process.stdout.write(data));

    p.stderr.on('data', (data) => process.stderr.write(data));

    p.on('close', (code) => {
        if (code !== 0) {
            console.error(program, args, 'exited with', code);
        }
    })

    return p;

}

cmd("tsc", ['-w'])
cmd('http-server', ['-p', '3000', '-a', '127.0.0.1', '-s', '-c-1'])


const wss = new WebSocketServer({
    port: 3001
});


let websockets = [];

wss.on("connection", (ws) => {
    websockets.push(ws);

    ws.on("close", () => {
        websockets.splice(websockets.indexOf(ws), 1);
    });
});

const RELOAD_FILES = ["index.html", "index.js"]

RELOAD_FILES.forEach((file) => {
    watchFile(path.join(__dirname, file), { interval: 50 }, () => {
        websockets.forEach((ws) => ws.send("reload"));
    });
});
