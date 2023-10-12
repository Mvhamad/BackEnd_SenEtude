import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

const validationMiddleware = (schema: Joi.Schema): RequestHandler => {

    return async(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        }

        try {

            const value = await schema.validateAsync(
                request.body,
                validationOptions
            )
            request.body = value;
            next();
            
        } catch (e: any) {

            const errors: string[] = [];
            e.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push(error.message)
            });
            response.status(400).send({
                errors
            })
        }
    }
}

export default validationMiddleware