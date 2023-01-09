import file from '../types/file';

enum Action {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Timestamp,
  ManyToOne,
} from 'typeorm';
import { Company } from './Company.entity';
import { Package } from './Package.entity';
import { User } from './User.entity';

@Entity('companyviewcount')
export class CompanyViewCount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'action',
    type: 'enum',
    enum: Action,
    default: Action.INREVIEW,
  })
  action: Action;

  @Column({ name: 'date', type: 'timestamp' })
  date: Date;

  @Column({ name: 'count', type: 'bigint' })
  count: bigint;

  @ManyToOne(() => User, (user) => user.companyViewCount)
  user: User;

  @ManyToOne(() => Company, (company) => company.companyViewCount)
  company: Company;
}
