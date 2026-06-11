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

}
