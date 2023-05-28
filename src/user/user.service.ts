import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInfoDto } from './dto/user-info.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Permission } from './entities/permission.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Permission)
    private readonly permission: Repository<Permission>,
  ) {}

  async login(userInfoDto: UserInfoDto) {
    const targetUser = await this.user.findOne({
      where: {
        username: userInfoDto.username,
      },
    });
    if (!targetUser)
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    return jwt.sign(userInfoDto, 'secret', {
      expiresIn: '1h',
      algorithm: 'HS256',
    });
  }

  async setPermissions(userInfoDto: UserInfoDto) {
    const { id, permissions } = userInfoDto;
    const permissionInstanceList: Permission[] = [];
    for (const permissionName of permissions) {
      const permission = new Permission();
      permission.name = permissionName;
      permission.id = v4();
      const instance = await this.permission.save(permission);
      permissionInstanceList.push(instance);
    }
    const targetUser = await this.user.findOne({
      where: { id },
    });
    targetUser.permissions = permissionInstanceList;
    await this.user.save(targetUser);
  }

  create(userInfoDto: UserInfoDto) {
    const newUser = new User();
    const { username, password } = userInfoDto;
    const isExisted = this.user.findOne({
      where: {
        username,
      },
    });
    if (isExisted)
      throw new HttpException('用户名已经存在', HttpStatus.BAD_REQUEST);
    Object.assign(newUser, {
      username,
      password,
      id: v4(),
    });
    return this.user.save(newUser);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
