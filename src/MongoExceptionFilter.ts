import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  
  @Catch(Error)
  export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
  
      console.error('MongoDB Error:', exception.message);
  
      response.status(status).json({
        statusCode: status,
        message: exception.message || 'Internal Server Error',
      });
    }
  }
  