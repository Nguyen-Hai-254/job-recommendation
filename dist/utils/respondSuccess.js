"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function respondSuccess(res, message, data = null, status = 200) {
    return res.status(status).json({
        message: message,
        status: status,
        data: data
    });
}
exports.default = respondSuccess;
//# sourceMappingURL=respondSuccess.js.map