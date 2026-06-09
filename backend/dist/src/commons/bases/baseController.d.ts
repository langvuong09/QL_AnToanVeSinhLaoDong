import { DeleteResult, ObjectLiteral, UpdateResult } from 'typeorm';
import { ResponseData } from '../response';
import { GetAllDto } from './baseDto';
import { BaseService } from './baseService';
export declare class BaseController<T extends ObjectLiteral, F extends BaseService<T>> {
    private readonly baseService;
    constructor(baseService: F);
    get(getAllDto: GetAllDto, req: any): Promise<ResponseData<import("../response").List<T[]>>>;
    getDetail(getAllDto: GetAllDto, id: string, req: any): Promise<ResponseData<T>>;
    post(req: any, itemDto: T): Promise<ResponseData<T>>;
    put(req: any, id: string, itemDto: T): Promise<ResponseData<UpdateResult>>;
    putRelations(req: any, id: string, itemDto: T): Promise<ResponseData<T>>;
    deletes(req: any, ids: string[]): Promise<ResponseData<UpdateResult>>;
    detroys(req: any, ids: string[]): Promise<ResponseData<DeleteResult>>;
    delete(req: any, id: string): Promise<ResponseData<UpdateResult>>;
    destroy(id: string): Promise<void>;
}
