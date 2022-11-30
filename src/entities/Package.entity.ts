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
import { PackageFeatures } from './PackageFeatures.entity';
import { Subscription } from './Subscription.entity';

@Entity('package')
export class Package extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 75 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  @Column({ name: 'price_per_month', type: 'decimal' })
  pricePerMonth: number;

  @Column({ name: 'price_per_year', type: 'decimal' })
  pricePerYear: number;

  @Column({ name: 'is_deletable', type: 'boolean' })
  isDeletable: boolean;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.package)
  admin: Admin;

  @OneToMany(() => Subscription, (subscription) => subscription.package)
  subscription: Subscription;

  @OneToMany(
    () => PackageFeatures,
    (packageFeatures) => packageFeatures.package
  )
  packageFeatures: PackageFeatures;
}
