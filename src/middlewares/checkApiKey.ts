import { Request, Response, NextFunction } from "express";
import ErrorNotAuthorized from "../helpers/errors";


const checkApiKey = (req:Request, res:Response, next:NextFunction) => {
    const apiKey = req.get('x-api-key');
	if (!apiKey) throw new ErrorNotAuthorized('missing authorization token');
    next();
}

export default checkApiKey