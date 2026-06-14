/**
 * fullName?: string;
        dateOfBirth?: string;
        gender?: string;
        email?: string;
        province?: OpenAdress;
        district?: OpenAdress;
        ward?: OpenAdress;
        address?: string;
        roleId?: number;
        position?: string;
        status?: boolean;
        avatarId?: string;
 */

import { ElementAddress } from "../User";

export type Jwt = {
    "id": string,
    "doet": string,
    "username": string,
    "role": {
        "id": number,
        "code": string,
        "name": string
    },
    "createdBy": string,
    "createdAt": string,
    "updatedBy": string,
    "updatedAt": string,
    "deletedBy": string,
    "deletedAt": string,
    "phone": string,
    "quarter": string,

    "ward": ElementAddress,
    "district": ElementAddress,
    "province": ElementAddress,
    "address": string,
    
    "password": string,
    "fullName": string,
    "gender": string,
    "position": string,
    "email": string,
    "dateOfBirth": string,
    "status": boolean,

    "roleId": number,
    "avatarId": string,
    "doetId": string,

    "iat": number,
    "exp": number,
    "iss": string
}

export type JwtRole = {
    id: 4;
    role: string;
    name: string;
}