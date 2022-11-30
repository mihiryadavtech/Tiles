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
import { Category } from './Category.entity';
import { User } from './User.Entity';

@Entity('userdealingcategory')
export class UserDealingCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.user)
  relCategory: Category;

  @ManyToOne(() => User, (user) => user.category)
  relUser: User;
}
