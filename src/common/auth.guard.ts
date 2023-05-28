import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { auth } from '../utils/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      headers: { authorization: tokenStr },
      originalUrl,
    } = context.switchToHttp().getRequest<Request>();

    if (originalUrl.includes('/login')) return true;

    if (!tokenStr) throw new HttpException('Missing user token', 500);
    const parts = tokenStr.split(' ');
    if (parts.length === 2) {
      const [scheme, token] = parts;
      if (/^Bearer$/.test(scheme)) {
        try {
          await auth(token);
          return true;
        } catch (e) {
          throw new HttpException(e.message, 401);
        }
      }
    }
  }
}
