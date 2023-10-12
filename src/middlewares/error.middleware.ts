import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/exceptions/http.exception";

/** 
 * 
 */
const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction): void => {
    const status = error.status || 500;
    const message = error.message || 'Une erreur est survenue lors de la demande.'

    response.status(status).send({
        status,
        message
    })

}

export default errorMiddleware