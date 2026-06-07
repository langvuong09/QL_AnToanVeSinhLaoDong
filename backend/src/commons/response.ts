import { HttpStatus } from '@nestjs/common';
import { LoginModel } from 'src/modules/auth/auth.model';
import { View } from 'typeorm';
//import * as ERROR from './error';

export interface ResponseData<T> {
    data?: T;
    message?: string;
    code?: number;
    success?: boolean;
}

export interface List<T> {
    items: T[];
    count?: number;
    pageSize?: number;
    pageNumber?: number;
    common?: any;
}

interface Code{
    code: number;
    message: string;
}

export default class Response {
  static WRONG_TOKEN(WRONG_TOKEN: any) {
    throw new Error('Method not implemented.');
  }
  static errorBad(WRONG_TOKEN: any) {
    throw new Error('Method not implemented.');
  }
  static get<T>(rs: LoginModel): ResponseData<import("../modules/auth/auth.model").LoginModel> | PromiseLike<ResponseData<import("../modules/auth/auth.model").LoginModel>> {
    throw new Error("Method not implemented.");
  }
  static getList<T>(list: List<View[]>): ResponseData<List<View[]>> | PromiseLike<ResponseData<List<View[]>>> {
      throw new Error('Method not implemented.');
  }
  static errorNotFound(arg0: string) {
    throw new Error("Method not implemented.");
  }
  static errorInternal(error: unknown) {
    throw new Error("Method not implemented.");
  }
  static SUCCESSFULLY: any;
    
}
