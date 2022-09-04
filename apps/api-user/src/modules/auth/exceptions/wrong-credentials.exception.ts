import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super(`Wrong credentials`, HttpStatus.BAD_REQUEST);
  }
}
