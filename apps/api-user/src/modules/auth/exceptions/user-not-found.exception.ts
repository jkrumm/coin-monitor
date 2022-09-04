import { HttpException, HttpStatus } from '@nestjs/common';

export class IdentityWithEmailNotFoundException extends HttpException {
  constructor() {
    super(`Identity with given email does not exist`, HttpStatus.NOT_FOUND);
  }
}

export class IdentityWithAuthIdNotFoundException extends HttpException {
  constructor() {
    super(`Identity with given authId does not exist`, HttpStatus.NOT_FOUND);
  }
}
