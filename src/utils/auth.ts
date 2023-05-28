import { JwtPayload } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export function auth(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'secret', (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded);
    });
  });
}
