
import {
  BaseEntity,
  Column, Entity, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';
import { AreaType } from './AreaType.entity';
import { Attributes } from './Attributes.entity';
import { AttributesValues } from './AttributesValues.entity';
import { Banners } from './Banners.entity';
import { Catalogue } from './Catalogue.entity';
import { Category } from './Category.entity';
import { Collection } from './Collection.entity';
import { Company } from './Company.entity';
import { Contact } from './Contact.entity';
import { Features } from './Features.entity';
import { Grade } from './Grade.entity';
import { Package } from './Package.entity';
import { Product } from './Product.entity';
import { QuantityType } from './QuantityType.entity';
import { SalesType } from './SalesType.entity';
import { Size } from './Size.entity';
import { SponsoredAds } from './SponsoredAds.entity';
import { SubRole } from './SubRole.entity';

import { Type } from './Type.entity';
import { Unit } from './Unit.entity';
@Entity('admin')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 75 })
  name: string;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;
  
  @OneToMany(() => SubRole, (subRole) => subRole.admin)
  subrole: SubRole[];

  @OneToMany(() => Type, (type) => type.admin)
  type: Type[];

  @OneToMany(() => Company, (company) => company.admin)
  company: Type[];

  @OneToMany(() => Category, (category) => category.admin)
  category: Category[];

  @OneToMany(() => Grade, (grade) => grade.admin)
  grade: Grade[];

  @OneToMany(() => SalesType, (salesType) => salesType.admin)
  salesType: SalesType[];

  @OneToMany(() => Size, (size) => size.admin)
  size: Size[];

  @OneToMany(() => AreaType, (areaType) => areaType.admin)
  areaType: AreaType[];

  @OneToMany(() => Attributes, (attributes) => attributes.admin)
  attributes: Attributes[];

  @OneToMany(
    () => AttributesValues,
    (attributesValues) => attributesValues.admin
  )
  attributesValues: AttributesValues[];

  @OneToMany(() => Features, (features) => features.admin)
  features: Features[];

  @OneToMany(() => Unit, (unit) => unit.admin)
  unit: Features[];

  @OneToMany(() => QuantityType, (quantityType) => quantityType.admin)
  quantityType: QuantityType[];

  @OneToMany(() => Product, (product) => product.admin)
  product: Product[];

  @OneToMany(() => Package, (packages) => packages.admin)
  package: Package[];

  @OneToMany(() => Banners, (banners) => banners.admin)
  banners: Banners[];

  @OneToMany(() => SponsoredAds, (sponseredAds) => sponseredAds.admin)
  sponseredAds: SponsoredAds[];

  @OneToMany(() => Catalogue, (catalogue) => catalogue.admin)
  catalogue: Catalogue[];

  @OneToMany(() => Contact, (contact) => contact.admin)
  contact: Contact[];

  @OneToMany(() => Collection, (collection) => collection.admin)
  collection: Collection[];
}
