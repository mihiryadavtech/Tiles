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
} from 'typeorm';
import { Catalogue } from './Catalogue.entity';
import { User } from './User.Entity';

@Entity('catalogueviewer')
export class CatalogueViewer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'count', type: 'bigint' })
  count: bigint;

  @ManyToOne(() => Catalogue, (catalogue) => catalogue.userViewer)
  relCatalogue: Catalogue;

  @ManyToOne(() => User, (user) => user.catalogueViewer)
  relUser: User;
}
