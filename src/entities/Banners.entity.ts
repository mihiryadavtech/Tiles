import file from 'src/types/file';
enum Route {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}
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

import { Category } from './Category.entity';
import { Company } from './Company.entity';
import { Type } from './Type.entity';

@Entity('banners')
export class Banners extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Images', type: 'jsonb' })
  images: file;

  @Column({ name: 'visible_on_home', type: 'varchar', length: 100 })
  visibleOnHome: string;

  @Column({ name: 'route', type: 'enum', enum: Route, default: Route.INREVIEW })
  route: Route;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.banners)
  admin: Admin;

  @ManyToOne(() => Type, (type) => type.banners)
  type: Type;

  @ManyToOne(() => Category, (category) => category.banners)
  category: Category;

  @ManyToOne(() => Company, (company) => company.banners)
  company: Company;
}
