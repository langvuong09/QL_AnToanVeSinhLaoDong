import { BaseService } from "../../commons/bases";
import { EntityManager, DataSource, Repository } from "typeorm";
import { Doet } from "./doet.entity";
import { MediaService } from "../media/media.service";
export declare class DoetService extends BaseService<Doet> {
    private readonly dataSource;
    private readonly mediaService;
    private readonly doetRepository;
    manager: EntityManager;
    constructor(dataSource: DataSource, mediaService: MediaService, doetRepository: Repository<Doet>);
}
