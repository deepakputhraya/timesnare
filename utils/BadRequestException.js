class BadRequestException extends Error{
    constructor(message) {
        super();
        this.status = 400;
        this.message = message || "Bad request"
    }
}
module.exports = BadRequestException;
