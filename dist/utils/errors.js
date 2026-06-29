export class AppError extends Error {
    statusCode;
    errors;
    constructor(statusCode, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = "AppError";
    }
}
//# sourceMappingURL=errors.js.map