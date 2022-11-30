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
import { Collection } from './Collection.entity';

@Entity('collectioncategory')
export class CollectionCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.collection)
  relCategory: Category;

  @ManyToOne(() => Collection, (collection) => collection.category)
  relcollection: Collection;
}
