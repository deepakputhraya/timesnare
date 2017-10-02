const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next => {
        return res.status(next.status || 500).json({message : next.message || "Internal Server Error"});
    });
};

module.exports = asyncMiddleware;
