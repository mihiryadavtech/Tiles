import file from 'src/interfaces/file';
enum Status {
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

  @ManyToOne(() => Catalogue, (catalogue) => catalogue.privateUser, {
    onDelete: 'CASCADE',
  })
  relCatalogue: Catalogue;

  @ManyToOne(() => User, (user) => user.privateCatalogue)
  relUser: User;
}
