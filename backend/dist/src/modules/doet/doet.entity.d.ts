import { BaseAddressEntity } from "../../commons/bases/baseAddressEntity";
import { FileEntity } from "../media/media.entity";
import { BusinessType } from "../bussinessType/business-type.entity";
import { Industry } from "../industry/industry.entity";
import { Report } from "../report/report.entity";
export declare class Doet extends BaseAddressEntity {
    id: number;
    name: string;
    taxCode: string;
    issuedDate: Date;
    businessTypeId: number;
    businessType: BusinessType;
    industryId: number;
    industry: Industry;
    foreignName: string;
    representative: string;
    repPhone: string;
    files: FileEntity[];
    reports: Report[];
}
