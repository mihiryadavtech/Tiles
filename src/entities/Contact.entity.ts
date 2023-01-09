import file from '../types/file';

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
import { Company } from './Company.entity';
import { CompanyUser } from './CompanyUser.entity';
import { User } from './User.entity';
@Entity('contact')
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'lat_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'mobile', type: 'varchar', length: 15 })
  mobile: number;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string;

  @Column({ name: 'send_sms', type: 'boolean' })
  sendSms: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.contact)
  admin: Admin;

  @ManyToOne(() => User, (user) => user.contact)
  user: User;

  @OneToMany(() => CompanyUser, (companyuser) => companyuser.relContact)
  company: CompanyUser[];
}
