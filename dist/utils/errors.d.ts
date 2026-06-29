import type { ApiFieldError } from "./response.js";
export declare class AppError extends Error {
    statusCode: number;
    errors?: ApiFieldError[] | undefined;
    constructor(statusCode: number, message: string, errors?: ApiFieldError[] | undefined);
}
//# sourceMappingURL=errors.d.ts.map