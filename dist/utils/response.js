export function sendSuccess(res, data, message = "Success", statusCode = 200, meta) {
    const body = {
        success: true,
        message,
        data,
        ...(meta ? { meta } : {}),
    };
    return res.status(statusCode).json(body);
}
export function sendError(res, statusCode, message, errors) {
    const body = {
        success: false,
        message,
        data: null,
        ...(errors?.length ? { errors } : {}),
    };
    return res.status(statusCode).json(body);
}
//# sourceMappingURL=response.js.map