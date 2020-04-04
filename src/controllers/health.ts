
import * as pkg from '../../package.json';
import { Request, Response } from 'express';

export const getVersionResponse = (req:Request, res:Response) => {
    res.status(200).send({version: pkg.version})
}