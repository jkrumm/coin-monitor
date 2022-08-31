import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotUniqueException extends HttpException {
  constructor(email: string) {
    super(
      `Identity with Email ${email} already exists`,
      HttpStatus.BAD_REQUEST
    );
  }
}
