import file from 'src/interfaces/file';

import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Timestamp,
  ManyToOne
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
