
import {
  BaseEntity,
  Column, CreateDateColumn, Entity, ManyToOne,
  OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Admin } from './Admin.entity';
import { CatalogueSizes } from './CatalogueSizes.entity';
import { CategorySize } from './CategorySize.entity';
import { Post } from './Post.entity';
import { Product } from './Product.entity';

@Entity('size')
export class Size extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @Column({ name: 'size_mm', type: 'jsonb', nullable: true })
  sizemm: {};

  @Column({ name: 'size_cm', type: 'jsonb', nullable: true })
  sizecm: {};

  @Column({ name: 'size_inch', type: 'jsonb', nullable: true })
  sizeinch: {};

  @Column({ name: 'size_feet', type: 'jsonb', nullable: true })
  sizefeet: {};

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.size)
  admin: Admin[];

  @OneToMany(() => Post, (post) => post.size)
  post: Post[];

  @OneToMany(() => Product, (product) => product.size)
  product: Post[];

  @OneToMany(() => CatalogueSizes, (cataloguesizes) => cataloguesizes.relSize)
  catalogue: CatalogueSizes[];

  @OneToMany(() => CategorySize, (categorysize) => categorysize.relSize)
  category: CategorySize[];
}
