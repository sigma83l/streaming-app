import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { ExecutionContext, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as Sentry from '@sentry/node';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter{
    constructor(private readonly httpAdapterHost: HttpAdapterHost){}

    private logger = new Logger('HTTP');
    catch(exception: unknown, host:ArgumentsHost){
        const ctx = host.switchToHttp();
        const { httpAdapter } = this.httpAdapterHost;

        const httpStatus = 
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        
        const responseBody = 
            this.inferSystemError(exception, ctx) ??
            this.inferDataBaseError(exception, ctx) ??
            this.inferUnHandledError(exception, ctx);
        httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
        console.log(exception)
    }
    inferSystemError(exception, ctx: HttpArgumentsHost){
        const { httpAdapter } = this.httpAdapterHost;

        if (exception instanceof HttpException) {
            if (exception.getStatus() >= 500){
                Sentry.captureException(exception);
                this.logger.log(`server side exception occured ${exception}`);
            }
            const message = 
                exception.getStatus() >= 500
                ? "Internal Error Occurred!"
                : exception.getResponse()
            return {
                statusCode: exception.getStatus(),
                timeStamp: new Date().toISOString(),
                message,
                path: httpAdapter.getRequestUrl(ctx.getRequest()),
            };
        }
        return undefined;
    }
    inferDataBaseError(exception, ctx: HttpArgumentsHost){
        const { httpAdapter } = this.httpAdapterHost;

        if (exception instanceof PrismaClientKnownRequestError) {
            Sentry.captureException(exception);
            this.logger.log(`A prisma exception occured: ${exception}`)
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                timeStamp: new Date().toISOString(),
                message: "(PRISMA) Database Error Occurred! ",
                path: httpAdapter.getRequestUrl(ctx.getRequest()),
            };
        }
        return undefined;
    }
    inferUnHandledError(exception, ctx: HttpArgumentsHost){
        const { httpAdapter } = this.httpAdapterHost;
        Sentry.captureException(exception);
        this.logger.log(`Unexpected Error Occurred: ${exception}`)

        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timeStamp: new Date().toISOString(),
            message: "Unexpected Error Occurred",
            path: httpAdapter.getRequestUrl(ctx.getRequest())
        }
    }

}