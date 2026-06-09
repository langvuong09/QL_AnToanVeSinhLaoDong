"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractHostname = extractHostname;
function extractHostname(url) {
    let hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split("/")[2];
    }
    else {
        hostname = url.split("/")[0];
    }
    hostname = hostname.split(":")[0];
    hostname = hostname.split("?")[0];
    return hostname;
}
//# sourceMappingURL=Domain.js.map