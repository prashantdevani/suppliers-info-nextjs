import { Response as ExpressResponse } from "express";
export declare class ActivityController {
    login(res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
}
