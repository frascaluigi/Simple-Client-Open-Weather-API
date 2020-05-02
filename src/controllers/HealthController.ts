
import * as pkg from '../../package.json';
import { Request, Response } from 'express';
import {config} from '../loadConfiguration';


class HealthController {

    static getVersionResponse = (req:Request, res:Response) => {
        res.status(200).send({version: pkg.version, env: config.get('env')})
    }
}

export default HealthController