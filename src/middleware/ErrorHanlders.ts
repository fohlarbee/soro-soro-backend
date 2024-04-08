import { NextFunction, Request, RequestHandler, Response } from "express";

export const notFound: RequestHandler = (req,res,next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error)

}

export const errorHandler = (err: Error , req: Request, res: Response, next: NextFunction) => {
const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
res.status(statusCode);

return res.json({mssg:err.message,
    stack:process.env.NODE_ENV === 'production' ? null : err.stack
})
}