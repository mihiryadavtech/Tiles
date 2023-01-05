
import {
  BaseEntity,
  Column, CreateDateColumn, Entity, ManyToOne,
  OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Admin } from './Admin.entity';
import { CollectionCategory } from './CollectionCategory.entity';
import { Type } from './Type.entity';
@Entity('collection')
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'visible_on_home', type: 'boolean' })
  visibleOnHome: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Type, (type) => type.collection)
  type: Type;

  @ManyToOne(() => Admin, (admin) => admin.collection)
  admin: Admin;

  @OneToMany(
    () => CollectionCategory,
    (collectioncategory) => collectioncategory.relcollection
  )
  category: CollectionCategory[];
}
