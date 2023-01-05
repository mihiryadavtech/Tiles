enum Status {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}

import {
  BaseEntity,
  Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Catalogue } from './Catalogue.entity';
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
