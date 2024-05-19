import { HttpException } from "../exceptions/httpException"

export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req?.role) next(new HttpException(401, 'Token is invalid'))
            
            const rolesArray = [...allowedRoles];
            const result = rolesArray.includes(req.role);
            if (!result) next(new HttpException(403, 'You are not authorized to do this'));
            next();
        } catch (error) {
            next(error)
        }
    }
}