import file from 'src/interfaces/file';
enum Status {
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
import { Catalogue } from './Catalogue.entity';
import { Category } from './Category.entity';
import { User } from './User.Entity';

@Entity('privatecataloguepermission')
export class PrivateCataloguePermission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.INREVIEW,
  })
  status: Status;

  @ManyToOne(() => Catalogue, (catalogue) => catalogue.privateUser)
  relCatelogue: Catalogue;

  @ManyToOne(() => User, (user) => user.privateCatelogue)
  relUser: User;
}
