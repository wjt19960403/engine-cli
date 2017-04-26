import * as cp from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
export function buildProject(callback: () => void) {
    let projectPath = process.cwd();
    executeCommand("tsc", ["-p", projectPath], callback);
}

export function buildCadence(callback: () => void) {
    let projectPath = process.cwd();
    let configFile = path.join(projectPath, "cadence.json");
    let config = fs.readJSONSync(configFile);
    let cadencePath = config.cadence;
    executeCommand("tsc", ["-p", cadencePath], () => {
        let source = path.join(cadencePath, "out");
        let target = path.join(projectPath, 'cadence');
        fs.copy(source, target, callback);
    });
}

function executeCommand(command: string, args: string[], callback: () => void) {
    let child_process = cp.exec(command, args);
    child_process.stdout.addListener("data", data => {
        console.log(data.toString())
    })
    child_process.stderr.addListener("data", data => {
        console.log(data.toString())
    })
    child_process.addListener("close", () => {
        callback();
    })
}

export function buildAll() {
    buildCadence(function () {
        buildProject(function () {

        });
    });
}