class InternalServerErrorException extends Error {
    constructor(message) {
        super();
        this.status = 500;
        this.message = message || "Internal Server Error"
    }
}
