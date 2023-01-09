
import {
  BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Category } from './Category.entity';
import { User } from './User.entity';

@Entity('userdealingcategory')
export class UserDealingCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.user)
  relCategory: Category;

  @ManyToOne(() => User, (user) => user.category)
  relUser: User;
}
