import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/exceptions/appException';

export class UserDontFoundIncorrectException extends AppException {
  constructor() {
    super({
      message: 'Usuário não encontrado!',
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
