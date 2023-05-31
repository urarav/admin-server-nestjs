import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: any) {
    return this.jwtService.sign({
      username: user.username,
      id: user.id,
    });
  }

  async validateUser(username: string, password: string) {
    const targetUser = await this.userService.findOne({ username });
    if (targetUser && targetUser.password === password) {
      const { username, id } = targetUser;
      return { username, id };
    }
    return null;
  }
}
