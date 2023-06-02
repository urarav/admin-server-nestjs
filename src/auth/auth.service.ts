import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: any) {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  async validateUser(username: string, password: string) {
    const targetUser = await this.userService.findOne({ username });
    if (!targetUser) return null;
    const { username: name, id, password: hash } = targetUser;
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch ? { username: name, id } : null;
  }
}
