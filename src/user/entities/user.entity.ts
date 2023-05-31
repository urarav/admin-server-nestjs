import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

enum AccountStatus {
  INACTIVE,
  ACTIVE,
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: 'enum',
    name: 'account_status',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  accountStatus: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_time' })
  createdTime: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_time' })
  updateTime: Date;

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[];
}
