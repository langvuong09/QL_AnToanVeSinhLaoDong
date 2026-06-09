import { DeleteResult, ObjectLiteral, Repository, UpdateResult } from "typeorm";
import { ResponseData, List } from "../response";
import { GetAllDto } from "./baseDto";
import { Doet } from "../../modules/doet/doet.entity";
export declare class BaseService<T extends ObjectLiteral> {
    private readonly baseRepository;
    private readonly newEntity;
    constructor(baseRepository: Repository<T>, newEntity: Function);
    get(getAllDto: GetAllDto, doet?: Doet | null): Promise<ResponseData<List<T[]>>>;
    getDetail(getAllDto: GetAllDto, id: string, doet: Doet | null): Promise<ResponseData<T>>;
    post(currentUser: any, itemDto: any, doet: Doet): Promise<ResponseData<T>>;
    put(currentUser: any, id: string, itemDto: any): Promise<ResponseData<UpdateResult>>;
    putRelations(currentUser: any, id: string, itemDto: T): Promise<ResponseData<T>>;
    delete(currentUser: any, id: string): Promise<ResponseData<UpdateResult>>;
    destroy(id: string): Promise<ResponseData<DeleteResult>>;
    deletes(currentUser: any, ids: string[], doet: Doet | null): Promise<ResponseData<UpdateResult>>;
    destroys(currentUser: any, ids: string[], doet: Doet | null): Promise<ResponseData<DeleteResult>>;
}
