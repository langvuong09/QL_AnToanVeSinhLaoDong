import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request , Response as ExpressResponse} from "express";
import { DataSource } from "typeorm";
import { extractHostname } from "../helper/Domain";
import { Doet } from "../modules/doet/doet.entity"; 
import Response from "../commons/response";

declare global {
  namespace Express {
    interface Request {
      doet?: Doet | null;
    }
  }
}

@Injectable()
export class DomainMiddleware implements NestMiddleware {
  constructor(private readonly dataSource: DataSource) {}
  async use(req: Request, res: ExpressResponse, next: NextFunction) {
    const fullDomain = req.get("origin") || req.get("host");
    if (fullDomain) {
      const domain = extractHostname(fullDomain);
      if (domain != "admin-dev.rcp.com.vn" && domain != "admin.rcp.com.vn") {
        const manage = this.dataSource.manager;
        req.doet = await manage.findOne(Doet, {
          where: {
            domain: domain
          }
        });
      }
    } else {
      throw Response.errorInternal("Cannot get domain");
    }
    next();
  }
}
