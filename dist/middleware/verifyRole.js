"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = void 0;
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!(req === null || req === void 0 ? void 0 : req.role)) {
            return res.status(401).json({
                message: 'Token is valid',
                status: 401
            });
        }
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.role);
        if (!result) {
            return res.status(403).json({
                message: 'You are not authorized to do this',
                status: 403
            });
        }
        next();
    };
};
exports.verifyRole = verifyRole;
//# sourceMappingURL=verifyRole.js.map