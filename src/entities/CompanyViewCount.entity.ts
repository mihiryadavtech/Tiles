import file from 'src/interfaces/file';

enum Action {
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  INREVIEW = 'InReview',
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
import { Company } from './Company.entity';
import { Package } from './Package.entity';
import { User } from './User.Entity';

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
