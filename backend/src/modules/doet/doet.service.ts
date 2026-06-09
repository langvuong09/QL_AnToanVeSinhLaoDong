import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/commons/bases";
import { EntityManager, DataSource, In, Repository } from "typeorm";
import { Doet } from "./doet.entity";
import Response from "../../commons/response";
import { MediaService } from "../media/media.service";
import { KeyValue } from "../../commons/bases/baseAddressEntity";

@Injectable()
export class DoetService extends BaseService<Doet> {
  manager: EntityManager;
  constructor(
    private readonly dataSource: DataSource,
    private readonly mediaService: MediaService,
    @InjectRepository(Doet)
    private readonly doetRepository: Repository<Doet>,
  ) {
    super(doetRepository, (data) => new Doet(data));
    this.manager = this.dataSource.manager; 
  }

  async getSetting(doet: Doet) {
    if (doet && doet.id) {
      return {
        name: doet.name2,
        province: doet.province2,
        logo: doet.logo ? await this.mediaService.generateUrl(doet.logo) : null,
        favicon: doet.favicon ? await this.mediaService.generateUrl(doet.favicon) : null
      };
    }
    throw Response.errorNotFound(Response.NOT_FOUND("doet_id"));
  }

  async updateSetting(doet: Doet, name, logo, favicon, province) {
    try {
      if (doet && doet.id) {
        const data: {
          name2: string,
          province2: KeyValue,
          logo?: string,
          favicon?: string,
        } = {
          name2: name,
          province2: province,
        };
        if (logo) {
          data.logo = logo;
        }
        if (favicon) {
          data.favicon = favicon;
        }
        await this.doetRepository.update({
          id: doet.id
        }, data);
        return Response.SUCCESSFULLY;
      }
      throw Response.errorNotFound(Response.NOT_FOUND("doet_id"));
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }
}
