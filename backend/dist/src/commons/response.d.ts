import { HttpStatus } from '@nestjs/common';
import * as ERROR from './error';
export interface ResponseData<T> {
    data?: T;
    message?: string;
    code?: number;
    success?: boolean;
}
export interface List<T> {
    items: T;
    count?: number;
    pageSize?: number;
    pageNumber?: number;
    common?: any;
}
interface Code {
    code: number;
    message: string;
}
export default class Response {
    static SUCCESSFULLY: {
        code: HttpStatus;
        message: string;
        success: boolean;
    };
    static SOMETHING_WRONG: {
        code: number;
        message: string;
    };
    static NOT_FOUND(name: string): Code;
    static EXISTED(name: string): Code;
    static DOET_OR_MOET_NOT_FOUND: {
        code: number;
        message: string;
    };
    static SCHOOL_YEAR_EXISTED: {
        code: number;
        message: string;
    };
    static DOCUMENT_NOT_SUPPORT: {
        code: number;
        message: string;
    };
    static WRONG_PASS: {
        code: number;
        message: string;
    };
    static DISABLE_USER: {
        code: number;
        message: string;
    };
    static PERMISSION: {
        code: number;
        message: string;
    };
    static WRONG_TOKEN: {
        code: number;
        message: string;
    };
    static getList<T>(list: List<T[]>): ResponseData<List<T[]>>;
    static get<T>(data: T): ResponseData<T>;
    static errorInternal(data?: any): ERROR.SomethingException;
    static errorNotFound(error?: any): ERROR.NotFoundException;
    static errorBad(error?: any): ERROR.BadRequestException;
    static errorForBidden(error?: any): ERROR.ForBiddenException;
}
export {};
