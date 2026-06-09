import { Doet } from "./doet.entity";
import { DoetService } from "./doet.service";
import { KeyValue } from "../../commons/bases/baseAddressEntity";
import { BaseController } from "../../commons/bases";
export declare class DoetController extends BaseController<Doet, DoetService> {
    private readonly doetService;
    constructor(doetService: DoetService);
    getSetting(req: any): Promise<any>;
    updateSetting(req: any, name: string, logo: string, favicon: string, province: KeyValue): Promise<any>;
}
