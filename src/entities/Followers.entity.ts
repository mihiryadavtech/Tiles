import file from 'src/interfaces/file';

import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Timestamp,
  ManyToOne,
} from 'typeorm';
import { User } from './User.Entity';

@Entity('followers')
export class Followers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.followsWhom)
  byWhom: User;

  @ManyToOne(() => User, (user) => user.followsTo)
  toWhom: User;
}
