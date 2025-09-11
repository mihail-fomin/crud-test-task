import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MulterError } from 'multer';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Внутренняя ошибка сервера';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string }).message || message;
    } else if (exception instanceof MulterError) {
      // Обработка ошибок Multer
      switch (exception.code) {
        case 'LIMIT_FILE_SIZE':
          status = HttpStatus.PAYLOAD_TOO_LARGE;
          message = 'Размер файла превышает максимально допустимый (10MB)';
          break;
        case 'LIMIT_FILE_COUNT':
          status = HttpStatus.BAD_REQUEST;
          message = 'Слишком много файлов';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          status = HttpStatus.BAD_REQUEST;
          message = 'Неожиданное поле файла';
          break;
        case 'LIMIT_PART_COUNT':
          status = HttpStatus.BAD_REQUEST;
          message = 'Слишком много частей';
          break;
        case 'LIMIT_FIELD_KEY':
          status = HttpStatus.BAD_REQUEST;
          message = 'Слишком длинное имя поля';
          break;
        case 'LIMIT_FIELD_VALUE':
          status = HttpStatus.BAD_REQUEST;
          message = 'Слишком длинное значение поля';
          break;
        case 'LIMIT_FIELD_COUNT':
          status = HttpStatus.BAD_REQUEST;
          message = 'Слишком много полей';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Ошибка загрузки файла';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    console.error('Exception caught by filter:', {
      message: exception instanceof Error ? exception.message : 'Unknown error',
      stack: exception instanceof Error ? exception.stack : undefined,
      url: request.url,
      method: request.method,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
