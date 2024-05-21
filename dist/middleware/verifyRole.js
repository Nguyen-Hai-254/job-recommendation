"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = void 0;
const httpException_1 = require("../exceptions/httpException");
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!(req === null || req === void 0 ? void 0 : req.role))
                next(new httpException_1.HttpException(401, 'Token is invalid'));
            const rolesArray = [...allowedRoles];
            const result = rolesArray.includes(req.role);
            if (!result)
                next(new httpException_1.HttpException(403, 'You are not authorized to do this'));
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.verifyRole = verifyRole;
//# sourceMappingURL=verifyRole.js.map