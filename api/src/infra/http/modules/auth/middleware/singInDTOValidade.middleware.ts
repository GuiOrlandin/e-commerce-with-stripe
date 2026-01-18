import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { SignInBody } from 'src/infra/http/modules/auth/dtos/signInBody';

@Injectable()
export class SignInDTOValidateMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    const signInBody = new SignInBody();

    signInBody.email = body.email;
    signInBody.password_hash = body.password_hash;

    const validations = await validate(signInBody);

    if (validations.length) {
      throw new BadRequestException(validations);
    }

    next();
  }
}
