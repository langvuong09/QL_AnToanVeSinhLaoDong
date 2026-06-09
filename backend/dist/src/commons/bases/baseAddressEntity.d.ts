import { BaseEntity } from '.';
export declare class KeyValue {
    key: any;
    value: string;
    constructor(keyValue: Partial<KeyValue>);
}
export declare abstract class BaseAddressEntity extends BaseEntity {
    constructor(baseEntity: Partial<BaseEntity>);
    phone: string;
    address: string;
    quarter: string;
    ward: KeyValue;
    district: KeyValue;
    province: KeyValue;
}
