import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInfoDto } from './dto/user-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Permission } from './entities/permission.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
  }

  async setPermissions(userInfoDto: UserInfoDto) {
    const { id, permissions } = userInfoDto;
    const permissionInstanceList: Permission[] = [];
    for (const permissionName of permissions) {
      const permission = new Permission();
      permission.name = permissionName;
      permission.id = v4();
      const instance = await this.permissionRepository.save(permission);
      permissionInstanceList.push(instance);
    }
    const targetUser = await this.findOne({ id });
    if (!targetUser)
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    await this.permissionRepository.delete({ userId: targetUser.id });
    targetUser.permissions = permissionInstanceList;
    await this.userRepository.save(targetUser);
  }

  async create(userInfoDto: UserInfoDto) {
    const newUser = new User();
    const { username, password } = userInfoDto;
    const targetUser = await this.findOne({ username });
    const salts = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salts);
    if (targetUser)
      throw new HttpException('用户名已经存在', HttpStatus.BAD_REQUEST);
    Object.assign(newUser, {
      username,
      password: hash,
      id: v4(),
    });
    await this.userRepository.save(newUser);
    return null;
  }

  async findOne(opt: FindOptionsWhere<User>) {
    return await this.userRepository.findOne({
      where: opt,
      relations: ['permissions'],
      select: ['username', 'permissions', 'id', 'accountStatus'],
    });
  }
}
