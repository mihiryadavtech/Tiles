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
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Admin } from './Admin.entity';
import { Company } from './Company.entity';
import { User } from './User.Entity';

@Entity('subrole')
export class SubRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', nullable: true })
  slug: string;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @Column({ name: 'is_deletable', type: 'boolean' })
  isDeletable: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.subrole)
  admin?: Admin;

  @OneToMany(() => User, (user) => user.subrole)
  user: User[];

  @OneToMany(() => Company, (company) => company.subrole)
  company: Company[];
}
