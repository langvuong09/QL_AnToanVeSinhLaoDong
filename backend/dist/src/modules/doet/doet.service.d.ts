import { BaseService } from "../../commons/bases";
import { EntityManager, DataSource, Repository } from "typeorm";
import { Doet } from "./doet.entity";
import { MediaService } from "../media/media.service";
import { KeyValue } from "../../commons/bases/baseAddressEntity";
export declare class DoetService extends BaseService<Doet> {
    private readonly dataSource;
    private readonly mediaService;
    private readonly doetRepository;
    manager: EntityManager;
    constructor(dataSource: DataSource, mediaService: MediaService, doetRepository: Repository<Doet>);
    getSetting(doet: Doet): Promise<{
        name: string;
        province: KeyValue;
        logo: any;
        favicon: any;
    }>;
    updateSetting(doet: Doet, name: any, logo: any, favicon: any, province: any): Promise<{
        code: import("@nestjs/common").HttpStatus;
        message: string;
        success: boolean;
    }>;
}
