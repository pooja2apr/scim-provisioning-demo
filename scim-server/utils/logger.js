const fs = require("fs");

function writeLog(action, details) {

    const log = `
[${new Date().toISOString()}]
${action}
${details}

`;

    fs.appendFileSync("logs/audit.log", log);

}

module.exports = writeLog;