import { PartialType } from '@nestjs/mapped-types';
import { UserInfoDto } from './user-info.dto';

export class UpdateUserDto extends PartialType(UserInfoDto) {}
