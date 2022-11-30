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
} from 'typeorm';
import { Admin } from './Admin.entity';
import { Company } from './Company.entity';
import { User } from './User.Entity';
@Entity('sponsoredads')
export class SponsoredAds extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Images', type: 'jsonb' })
  images: file;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.sponseredAds)
  admin: Admin;

  @ManyToOne(() => Company, (company) => company.sponseredAds)
  company: Company;
}
