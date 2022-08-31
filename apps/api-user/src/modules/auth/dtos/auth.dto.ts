import { AuthInterface } from '@cm/types';

export class AuthDto implements AuthInterface {
  authId: string;
  username: string;
  email: string;
}
