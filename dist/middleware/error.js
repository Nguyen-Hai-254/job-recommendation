"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (error, req, res, next) => {
    try {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        res.status(status).json({
            status: status,
            message: message
        });
    }
    catch (error) {
        next(error);
    }
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.js.map