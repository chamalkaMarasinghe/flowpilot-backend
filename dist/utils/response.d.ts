import type { Response } from "express";
export interface ApiFieldError {
    field?: string;
    message: string;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T | null;
    errors?: ApiFieldError[];
    meta?: Record<string, unknown>;
}
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: Record<string, unknown>): Response<any, Record<string, any>>;
export declare function sendError(res: Response, statusCode: number, message: string, errors?: ApiFieldError[]): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map