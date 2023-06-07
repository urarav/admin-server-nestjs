import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfoDto } from './dto/user-info.dto';
import { SkipAuth } from '../auth/decorator/skip-auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('setPermissions')
  setPermissions(@Body() userInfoDto: UserInfoDto) {
    return this.userService.setPermissions(userInfoDto);
  }

  @SkipAuth()
  @Post('register')
  create(@Body() userInfoDto: UserInfoDto) {
    return this.userService.create(userInfoDto);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const result = await this.userService.findOne(req.user);
    delete result.password;
    return result;
  }
}
