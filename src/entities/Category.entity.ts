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
import { Banners } from './Banners.entity';
import { Catalogue } from './Catalogue.entity';
import { CategorySize } from './CategorySize.entity';
import { CategoryUnit } from './CategoryUnit.entity';
import { CollectionCategory } from './CollectionCategory.entity';
import { Company } from './Company.entity';
import { CompanyDealingCategory } from './CompanyDealingCategory.entity';
import { Inquiries } from './Inquiries.entity';
import { Post } from './Post.entity';
import { PrivateCataloguePermission } from './PrivateCataloguePermission.entity';
import { Product } from './Product.entity';
import { Type } from './Type.entity';
import { UserDealingCategory } from './UserDealingCategory.entity';
@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 75 })
  name: string;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Type, (type) => type.category)
  type: Type;

  @ManyToOne(() => Admin, (admin) => admin.category)
  admin: Admin;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];

  @OneToMany(() => Post, (post) => post.category)
  post: Post[];

  @OneToMany(() => Banners, (banners) => banners.category)
  banners: Banners[];

  @OneToMany(() => Inquiries, (inquiries) => inquiries.category)
  inquiries: Inquiries[];

  @OneToMany(() => Catalogue, (catalogue) => catalogue.category)
  catalogue: Catalogue[];

  @OneToMany(
    () => CompanyDealingCategory,
    (CompanyDealingCategory) => CompanyDealingCategory.category
  )
  CompanyDealingCategory: CompanyDealingCategory[];

  @OneToMany(
    () => CollectionCategory,
    (collectioncategory) => collectioncategory.relCategory
  )
  collection: CollectionCategory[];

  @OneToMany(
    () => UserDealingCategory,
    (userDealingCategory) => userDealingCategory.relCategory
  )
  user: UserDealingCategory[];

  @OneToMany(
    () => PrivateCataloguePermission,
    (privateCataloguePermission) => privateCataloguePermission.relCatalogue
  )
  privateUser: PrivateCataloguePermission[];

  @OneToMany(() => CategorySize, (categorysize) => categorysize.relCategory)
  size: CategorySize[];

  @OneToMany(() => CategoryUnit, (categoryunit) => categoryunit.relCategory)
  unit: CategoryUnit[];
}
