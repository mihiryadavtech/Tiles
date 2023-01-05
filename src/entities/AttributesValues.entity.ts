import file from 'src/types/file';

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
import { Attributes } from './Attributes.entity';
import { ProductAttributes } from './ProductAttributes.entity';
@Entity('attributesvalues')
export class AttributesValues extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.attributesValues)
  admin: Admin;

  @ManyToOne(() => Attributes, (attributes) => attributes.attributesValues)
  attributes: Attributes;

  @OneToMany(
    () => ProductAttributes,
    (productAttributes) => productAttributes.relAttribute
  )
  product: ProductAttributes[];
}
