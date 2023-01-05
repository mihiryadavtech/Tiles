
import {
  BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Category } from './Category.entity';
import { Size } from './Size.entity';
@Entity('categorysize')
export class CategorySize extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.size)
  relCategory: Category;

  @ManyToOne(() => Size, (size) => size.category)
  relSize: Size;
}
