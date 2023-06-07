import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    if (!targetUser)
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    const { username: name, id, password: hash } = targetUser;
    console.log(targetUser);
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) throw new HttpException('密码不正确', HttpStatus.BAD_REQUEST);
    return { username: name, id };
  }
}
