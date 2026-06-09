import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let code = 500;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      
      message = typeof res === 'object' && res !== null ? (res.message || res) : res;
      code = status; 
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false, 
      code: code,
      message: message,
      data: null,
    });
  }
}