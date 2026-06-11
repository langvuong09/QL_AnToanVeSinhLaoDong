import { BaseController } from "../../commons/bases";
import { View } from './view.entity';
import { List, ResponseData } from "../../commons/response";
import { ViewService } from './view.service';
export declare class ViewController extends BaseController<View, ViewService> {
    private readonly viewService;
    constructor(viewService: ViewService);
    getViewsByRoleCode(id: string): Promise<ResponseData<List<View[]>>>;
}
