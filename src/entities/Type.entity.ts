
import {
  BaseEntity,
  Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Admin } from './Admin.entity';
import { Banners } from './Banners.entity';
import { Category } from './Category.entity';
import { Collection } from './Collection.entity';
import { CompanyDealingCategory } from './CompanyDealingCategory.entity';
@Entity('type')
export class Type extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 75 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  @Column({ name: 'icon', type: 'varchar' })
  icon: string;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @Column({ name: 'is_deletable', type: 'boolean', nullable: true })
  isDeletable: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.type)
  admin: Admin;

  @OneToMany(() => Category, (category) => category.type)
  category: Category[];

  @OneToMany(() => Banners, (banners) => banners.type)
  banners: Banners[];

  @OneToMany(
    () => CompanyDealingCategory,
    (CompanyDealingCategory) => CompanyDealingCategory.type
  )
  CompanyDealingCategory: Banners[];

  @OneToMany(() => Collection, (collection) => collection.type)
  collection: Collection[];
}
