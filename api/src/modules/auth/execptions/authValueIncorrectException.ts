import { HttpStatus } from "@nestjs/common";
import { AppException } from "src/exceptions/appException";

export class AuthValueIncorrectException extends AppException {
  constructor() {
    super({
      message: "Email ou senha incorretos",
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
