import type { NextFunction, Request, Response } from "express";
export declare function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>>;
export declare function notFoundHandler(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map