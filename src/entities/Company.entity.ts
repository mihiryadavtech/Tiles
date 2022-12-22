import file from 'src/interfaces/file';

import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Timestamp,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Admin } from './Admin.entity';
import { Banners } from './Banners.entity';
import { Catalogue } from './Catalogue.entity';
import { CompanyDealingCategory } from './CompanyDealingCategory.entity';
import { CompanyUser } from './CompanyUser.entity';
import { CompanyViewCount } from './CompanyViewCount.entity';
import { SponsoredAds } from './SponsoredAds.entity';
import { SubRole } from './SubRole.entity';

@Entity('company')
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'logo', type: 'jsonb', nullable: true })
  logo: file;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'mobile', type: 'varchar', length: 15 })
  mobile: number;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', })
  password: string;

  @Column({ name: ' website', type: 'varchar', nullable: true })
  website: string;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address: string;

  @Column({ name: 'latitude', type: 'varchar', nullable: true })
  latitude: number;

  @Column({ name: 'logitude', type: 'varchar', nullable: true })
  longitude: number;

  @Column({ name: 'sponsered', type: 'boolean' })
  sponsered: boolean;

  @Column({ name: 'verified', type: 'boolean' })
  verified: boolean;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @Column({ name: 'cta', type: 'jsonb', nullable: true })
  cta: file;

  @Column({ name: 'description', type: 'varchar', length: 750, nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => SubRole, (subrole) => subrole.company)
  subrole: SubRole;

  @ManyToOne(() => Admin, (admin) => admin.company)
  admin: Admin;

  @OneToMany(
    () => CompanyViewCount,
    (companyViewCount) => companyViewCount.company
  )
  companyViewCount: CompanyViewCount;

  @OneToMany(() => Banners, (banners) => banners.company)
  banners: Banners[];

  @OneToMany(() => SponsoredAds, (sponseredAds) => sponseredAds.company)
  sponseredAds: SponsoredAds[];

  @OneToMany(() => Catalogue, (catalogue) => catalogue.companyOwner)
  catalogue: Catalogue[];

  @OneToMany(
    () => CompanyDealingCategory,
    (companyDealingCategory) => companyDealingCategory.company
  )
  CompanyDealingCategory: CompanyDealingCategory[];

  @OneToMany(() => CompanyUser, (CompanyUser) => CompanyUser.relCompany)
  contact: CompanyUser[];
}
