import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInfoDto } from './dto/user-info.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Permission } from './entities/permission.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Permission)
    private readonly permission: Repository<Permission>,
  ) {}

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
    const targetUser = await this.findOne({ id });
    targetUser.permissions = permissionInstanceList;
    await this.user.save(targetUser);
  }

  async create(userInfoDto: UserInfoDto) {
    const newUser = new User();
    const { username, password } = userInfoDto;
    const targetUser = await this.findOne({ username });
    if (targetUser)
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

  async findOne(opt: FindOptionsWhere<User>) {
    return await this.user.findOne({
      where: opt,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
