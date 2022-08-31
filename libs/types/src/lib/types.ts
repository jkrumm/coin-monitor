export interface RegisterInterface {
  email: string;
  username: string;
  password: string;
}

export interface AuthInterface {
  authId: string;
  username: string;
  email: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface RequestWithAuth extends Request {
  auth: AuthInterface;
}

export interface TokenPayload {
  authId: string;
}
