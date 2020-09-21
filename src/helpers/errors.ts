import { extend } from "lodash";


class ErrorNotAuthorized extends Error{
    status: number;

    constructor(message?:string){
        super();
        this.message = message;
        this.status = 401;
    }
}

export default ErrorNotAuthorized;