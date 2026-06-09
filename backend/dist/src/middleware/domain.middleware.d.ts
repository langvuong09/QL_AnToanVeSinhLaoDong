import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response as ExpressResponse } from "express";
import { DataSource } from "typeorm";
import { Doet } from "../modules/doet/doet.entity";
declare global {
    namespace Express {
        interface Request {
            doet?: Doet | null;
        }
    }
}
export declare class DomainMiddleware implements NestMiddleware {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    use(req: Request, res: ExpressResponse, next: NextFunction): Promise<void>;
}
