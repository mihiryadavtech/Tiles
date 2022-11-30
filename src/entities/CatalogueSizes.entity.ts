import file from 'src/interfaces/file';

import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  ManyToOne,
} from 'typeorm';
import { Catalogue } from './Catalogue.entity';
import { Size } from './Size.entity';
@Entity('cataloguesizes')
export class CatalogueSizes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Size, (size) => size.catalogue)
  relSize: Size;

  @ManyToOne(() => Catalogue, (catalogue) => catalogue.size)
  relCatalogue: Catalogue;
}
