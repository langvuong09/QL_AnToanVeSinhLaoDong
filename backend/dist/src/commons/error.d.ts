export declare const FIELD_DUPLICATED = "FIELD DUPLICATED";
export declare const BAD_REQUEST = "BAD REQUEST";
export declare const INTERNAL_SERVER_ERROR = "INTERNAL SERVER ERROR";
export declare const UNAUTHORIZED = "UNAUTHORIZED";
export declare const FORBIDDEN = "FORBIDDEN";
export declare const NOTFOUND = "NOTFOUND";
export declare const SOMETHING_WRONG = "SOMETHING WRONG";
export declare class ServiceError extends Error {
    name: string;
    status: number;
    code?: string;
    message: string;
    detail?: string;
    errors?: any;
    constructor(error: any);
}
export declare class BadRequestException extends ServiceError {
    constructor(error: any);
}
export declare class FieldDuplicatedException extends BadRequestException {
    field: any;
    constructor(error: any, fieldName: any);
}
export declare class NotFoundException extends BadRequestException {
    constructor(error: any);
}
export declare class NotAcceptableException extends BadRequestException {
    constructor(error: any);
}
export declare class SomethingException extends BadRequestException {
    constructor(error: any);
}
export declare class ForBiddenException extends ServiceError {
    constructor(error: any);
}
export declare class UnAuthorizedException extends ServiceError {
    constructor(error: any);
}
export declare class InternalServerException extends ServiceError {
    constructor(error: any);
}
