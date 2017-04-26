"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cp = require("child_process");
var fs = require("fs-extra");
var path = require("path");
function buildProject(callback) {
    var projectPath = process.cwd();
    executeCommand("tsc", ["-p", projectPath], callback);
}
exports.buildProject = buildProject;
function buildCadence(callback) {
    var projectPath = process.cwd();
    var configFile = path.join(projectPath, "cadence.json");
    var config = fs.readJSONSync(configFile);
    var cadencePath = config.cadence;
    executeCommand("tsc", ["-p", cadencePath], function () {
        var source = path.join(cadencePath, "out");
        var target = path.join(projectPath, 'cadence');
        fs.copy(source, target, callback);
    });
}
exports.buildCadence = buildCadence;
function executeCommand(command, args, callback) {
    var child_process = cp.exec(command, args);
    child_process.stdout.addListener("data", function (data) {
        console.log(data.toString());
    });
    child_process.stderr.addListener("data", function (data) {
        console.log(data.toString());
    });
    child_process.addListener("close", function () {
        callback();
    });
}
function buildAll() {
    buildCadence(function () {
        buildProject(function () {
        });
    });
}
exports.buildAll = buildAll;
//# sourceMappingURL=build.js.map