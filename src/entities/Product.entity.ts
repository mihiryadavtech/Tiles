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
  OneToMany,
} from 'typeorm';
import { Admin } from './Admin.entity';
import { Category } from './Category.entity';
import { ProductAttributes } from './ProductAttributes.entity';
import { Size } from './Size.entity';

@Entity('product')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 75 })
  name: string;

  @Column({ name: 'sku_code', type: 'varchar', length: 50 })
  skuCode: string;

  @Column({ name: 'specifications', type: 'varchar', nullable: true })
  specifications: string;

  @Column({ name: 'preview_image', type: 'varchar' })
  previewImage: string;

  @Column({ name: 'image', type: 'jsonb' })
  image: file;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.product)
  admin: Admin;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @ManyToOne(() => Size, (size) => size.product)
  size: Size;

  @OneToMany(
    () => ProductAttributes,
    (productAttributes) => productAttributes.relProduct
  )
  attributeValue: ProductAttributes[];
}
