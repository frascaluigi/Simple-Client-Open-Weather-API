
import * as pkg from '../../package.json';
import { Request, Response } from 'express';
import {config} from '../loadConfiguration';


class HealthController {

    static getVersionResponse = (req:Request, res:Response) => {
        res.status(200).send({
            app: config.get('app_name'),
            env: config.get('env'),
            version: pkg.version
        })
    }
}

export default HealthController