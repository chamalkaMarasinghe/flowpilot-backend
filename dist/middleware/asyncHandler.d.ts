import type { NextFunction, Request, Response, RequestHandler } from "express";
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function asyncHandler(fn: AsyncRequestHandler): RequestHandler;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map