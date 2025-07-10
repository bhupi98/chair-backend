import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost): void;
}
