"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationParser = void 0;
const paginationParser = (req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let num = parseInt(req.query.num) || 10;
    page = isNaN(page) || page < 1 ? 1 : page;
    num = isNaN(num) || num < 1 || num > 100 ? 10 : num;
    req.query.page = page; // page: range 1 -> ++
    req.query.num = num; // num : range 1 -> 100
    next();
};
exports.paginationParser = paginationParser;
//# sourceMappingURL=paginationParser.js.map