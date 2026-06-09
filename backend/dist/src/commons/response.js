"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const ERROR = __importStar(require("./error"));
class Response {
    static SUCCESSFULLY = {
        code: common_1.HttpStatus.OK,
        message: 'Successfully!',
        success: true
    };
    static SOMETHING_WRONG = { code: 3000, message: 'Something wrong' };
    static NOT_FOUND(name) {
        return { code: 3001, message: `${name} not found` };
    }
    static EXISTED(name) {
        return { code: 3001, message: `${name} had already existed` };
    }
    static DOET_OR_MOET_NOT_FOUND = {
        code: 3002,
        message: 'Doet or Moet not found'
    };
    static SCHOOL_YEAR_EXISTED = {
        code: 3031,
        message: 'School year had already existed'
    };
    static DOCUMENT_NOT_SUPPORT = { code: 3033, message: 'Document not support' };
    static WRONG_PASS = { code: 3034, message: 'Wrong password' };
    static DISABLE_USER = { code: 3035, message: 'User is disabled' };
    static PERMISSION = { code: 3036, message: "You don't have permission" };
    static WRONG_TOKEN = { code: 3037, message: 'Token is wrong' };
    static getList(list) {
        return {
            data: list,
            ...this.SUCCESSFULLY
        };
    }
    static get(data) {
        return {
            data,
            ...this.SUCCESSFULLY
        };
    }
    static errorInternal(data) {
        console.error(data);
        if (data?.status)
            return data;
        const error = data instanceof Error ? data.message : data;
        return new ERROR.SomethingException({ ...this.SOMETHING_WRONG, error });
    }
    static errorNotFound(error) {
        console.error(error);
        return new ERROR.NotFoundException(error);
    }
    static errorBad(error) {
        console.error(error);
        return new ERROR.BadRequestException(error);
    }
    static errorForBidden(error) {
        console.error(error);
        return new ERROR.ForBiddenException(error);
    }
}
exports.default = Response;
//# sourceMappingURL=response.js.map