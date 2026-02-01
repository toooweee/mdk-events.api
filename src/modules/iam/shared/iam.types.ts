import { Request } from 'express';

export interface TokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export type JwtVerifiedPayload = JwtPayload & {
  iat: string;
  exp: string;
};

export type RequestWithUser = Request & {
  id: string;
  email: string;
};

export type CurrentUser = {
  id: string;
  email: string;
};
