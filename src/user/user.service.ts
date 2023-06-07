import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInfoDto } from './dto/user-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Role } from './entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
  }

  async setPermissions(userInfoDto: UserInfoDto) {
    const { id, roles } = userInfoDto;
    const roleInstanceList: Role[] = [];
    for (const roleName of roles) {
      const role = new Role();
      role.name = roleName;
      role.id = v4();
      const instance = await this.roleRepository.save(role);
      roleInstanceList.push(instance);
    }
    const targetUser = await this.findOne({ id });
    if (!targetUser)
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    await this.roleRepository.delete({ userId: targetUser.id });
    targetUser.roles = roleInstanceList;
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
      relations: ['roles'],
    });
  }
}
