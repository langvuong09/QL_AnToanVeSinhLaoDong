import { Doet } from "./doet.entity";
import { DoetService } from "./doet.service";
import { BaseController } from "../../commons/bases";
export declare class DoetController extends BaseController<Doet, DoetService> {
    private readonly doetService;
    constructor(doetService: DoetService);
}
