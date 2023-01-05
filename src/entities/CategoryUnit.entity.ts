
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
import { Unit } from './Unit.entity';
@Entity('categoryunit')
export class CategoryUnit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.unit)
  relCategory: Category;

  @ManyToOne(() => Unit, (unit) => unit.category)
  relUnit: Unit;
}
