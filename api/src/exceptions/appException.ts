import { HttpException, HttpStatus } from '@nestjs/common';

export interface AppExceptionProps {
  message: string;
  status: HttpStatus;
  field?: {
    [key: string]: string;
  };
}

export class AppException extends HttpException {
  constructor({ field, message, status }: AppExceptionProps) {
    super(
      {
        message,
        field,
      },
      status,
    );
  }
}
