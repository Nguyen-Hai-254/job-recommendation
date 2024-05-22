export const paginationParser = (req, res, next) => {
    let page = parseInt(req.query.page as string) || 1;
    let num = parseInt(req.query.num as string) || 10;
  
    page = isNaN(page) || page < 1 ? 1 : page;
    num = isNaN(num) || num < 1 || num > 100 ? 10 : num;
  
    req.query.page = page; // page: range 1 -> ++
    req.query.num = num;   // num : range 1 -> 100
  
    next();
  };