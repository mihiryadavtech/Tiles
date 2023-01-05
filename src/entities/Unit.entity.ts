

import {
  BaseEntity,
  Column, CreateDateColumn, Entity, ManyToOne,
  OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Admin } from './Admin.entity';
import { CategoryUnit } from './CategoryUnit.entity';
import { Post } from './Post.entity';

@Entity('Unit')
export class Unit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: boolean;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.unit)
  admin: Admin;

  @OneToMany(() => Post, (post) => post.unit)
  post: Post[];

  @OneToMany(() => CategoryUnit, (categoryunit) => categoryunit.relUnit)
  category: CategoryUnit[];
}
