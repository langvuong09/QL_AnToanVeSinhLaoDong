"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerException = exports.UnAuthorizedException = exports.ForBiddenException = exports.SomethingException = exports.NotAcceptableException = exports.NotFoundException = exports.FieldDuplicatedException = exports.BadRequestException = exports.ServiceError = exports.SOMETHING_WRONG = exports.NOTFOUND = exports.FORBIDDEN = exports.UNAUTHORIZED = exports.INTERNAL_SERVER_ERROR = exports.BAD_REQUEST = exports.FIELD_DUPLICATED = void 0;
const common_1 = require("@nestjs/common");
exports.FIELD_DUPLICATED = 'FIELD DUPLICATED';
exports.BAD_REQUEST = 'BAD REQUEST';
exports.INTERNAL_SERVER_ERROR = 'INTERNAL SERVER ERROR';
exports.UNAUTHORIZED = 'UNAUTHORIZED';
exports.FORBIDDEN = 'FORBIDDEN';
exports.NOTFOUND = 'NOTFOUND';
exports.SOMETHING_WRONG = 'SOMETHING WRONG';
class ServiceError extends Error {
    name;
    status;
    code;
    message;
    detail;
    errors;
    constructor(error) {
        super();
        this.errors = error;
    }
}
exports.ServiceError = ServiceError;
class BadRequestException extends ServiceError {
    constructor(error) {
        super(error);
        this.message = exports.BAD_REQUEST;
        this.status = common_1.HttpStatus.BAD_REQUEST;
    }
}
exports.BadRequestException = BadRequestException;
class FieldDuplicatedException extends BadRequestException {
    field;
    constructor(error, fieldName) {
        super(error);
        this.message = exports.FIELD_DUPLICATED;
        this.field = fieldName;
    }
}
exports.FieldDuplicatedException = FieldDuplicatedException;
class NotFoundException extends BadRequestException {
    constructor(error) {
        super(error);
        this.message = exports.NOTFOUND;
        this.status = common_1.HttpStatus.NOT_FOUND;
    }
}
exports.NotFoundException = NotFoundException;
class NotAcceptableException extends BadRequestException {
    constructor(error) {
        super(error);
        this.message = exports.UNAUTHORIZED;
        this.status = common_1.HttpStatus.NOT_ACCEPTABLE;
    }
}
exports.NotAcceptableException = NotAcceptableException;
class SomethingException extends BadRequestException {
    constructor(error) {
        super(error);
        this.message = exports.INTERNAL_SERVER_ERROR;
        this.status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
exports.SomethingException = SomethingException;
class ForBiddenException extends ServiceError {
    constructor(error) {
        super(error);
        this.status = common_1.HttpStatus.FORBIDDEN;
        this.message = exports.FORBIDDEN;
    }
}
exports.ForBiddenException = ForBiddenException;
class UnAuthorizedException extends ServiceError {
    constructor(error) {
        super(error);
        this.status = common_1.HttpStatus.UNAUTHORIZED;
        this.message = exports.UNAUTHORIZED;
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class InternalServerException extends ServiceError {
    constructor(error) {
        super(error);
        this.status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        this.message = exports.INTERNAL_SERVER_ERROR;
    }
}
exports.InternalServerException = InternalServerException;
//# sourceMappingURL=error.js.map