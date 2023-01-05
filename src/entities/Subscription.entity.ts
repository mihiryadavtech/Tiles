
import {
  BaseEntity,
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Package } from './Package.entity';
import { User } from './User.Entity';

@Entity('subscription')
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'expiry_date', type: 'timestamp' })
  expiryDate: Date;

  @Column({ name: 'paid_date', type: 'timestamp' })
  paidDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.subscription)
  user: User;

  @ManyToOne(() => Package, (packages) => packages.subscription)
  package: Package;
}
