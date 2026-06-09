import { BaseAddressEntity, KeyValue } from "../../commons/bases/baseAddressEntity";
export declare class Doet extends BaseAddressEntity {
    constructor(doet: Partial<Doet>);
    id: number;
    name: string;
    name2: string;
    domain: string;
    parentId: number;
    logo: string;
    favicon: string;
    province2: KeyValue;
}
