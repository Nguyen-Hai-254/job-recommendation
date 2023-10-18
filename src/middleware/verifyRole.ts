export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) {
            return res.status(401).json({
                message: 'Token is valid',
                status: 401
            })
        }
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.role);
        if (!result) {
            return res.status(403).json({
                message: 'You are not authorized to do this',
                status: 403
            })
        }
        next();
    }
}