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
import { Catalogue } from './Catalogue.entity';
import { User } from './User.Entity';
@Entity('bookmarkedcatalogue')
export class BookmarkedCatalogue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Catalogue, (catalogue) => catalogue.user)
  relCatalogue: Catalogue;

  @ManyToOne(() => User, (user) => user.boookmarkCatalogue)
  relUser: User;

}
