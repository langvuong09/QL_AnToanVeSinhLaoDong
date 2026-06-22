import { ElementAddress } from "../User";
import { MediaUpload } from "./media";

export type UserDetail = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    position: string;
    avatar: MediaUpload;
    avatarId: string;

    address: string;
    province: ElementAddress;
    district: ElementAddress;
    ward: ElementAddress;

    quarter: string;
    doet: {
        address: string;
        businessTypeId: number;
        createdAt: string;
        createdBy: string;
        district: { key: string; value: string; }
        foreignName: string;
        id: number
        industryId: number;
        issuedDate: string;
        name: string;
        phone: string;
        province: { key: string; value: string; }
        quarter: { key: string; value: string; }
        repPhone: string;
        representative: string;
        status: boolean;
        taxCode: string;
        updatedAt: string;
        updatedBy: string;
    };
    doetId: number;
    roleId: number;
    role: {
        id: number;
        name: string;
        code: string;
    };
    status: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
};