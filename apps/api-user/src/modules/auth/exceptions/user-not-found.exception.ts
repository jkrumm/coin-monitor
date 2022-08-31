import { HttpException, HttpStatus } from '@nestjs/common';

export class UserWithEmailNotFoundException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} does not exist`, HttpStatus.NOT_FOUND);
  }
}

export class UserWithUserIdNotFoundException extends HttpException {
  constructor(userId: string) {
    super(`User with id ${userId} does not exist`, HttpStatus.NOT_FOUND);
  }
}
