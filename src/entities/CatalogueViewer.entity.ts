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

@Entity('catalogueviewer')
export class CatalogueViewer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'count', type: 'bigint' })
  count: bigint;

  @ManyToOne(() => Catalogue, (catalogue) => catalogue.userViewer)
  relCatelogue: Catalogue;

  @ManyToOne(() => User, (user) => user.catalogueViewer)
  relUser: User;
}
