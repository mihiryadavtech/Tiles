
import {
  BaseEntity,
  Column, CreateDateColumn, Entity, ManyToOne,
  OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Admin } from './Admin.entity';
import { Post } from './Post.entity';

@Entity('quantitytype')
export class QuantityType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @Column({ name: 'is_deletable', type: 'boolean' })
  isDeletable: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.quantityType)
  admin: Admin;

  @OneToMany(() => Post, (post) => post.quantityType)
  post: Post[];
}
