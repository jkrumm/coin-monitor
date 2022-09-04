import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotUniqueException extends HttpException {
  constructor() {
    super(`Identity with given email already exists`, HttpStatus.BAD_REQUEST);
  }
}
