import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Permission {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => User, (user) => user.permissions)
  @JoinColumn({ foreignKeyConstraintName: 'f_uk' })
  user: User;
}
