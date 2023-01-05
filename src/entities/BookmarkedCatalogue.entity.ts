
import {
  BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Catalogue } from './Catalogue.entity';
import { User } from './User.Entity';
@Entity('bookmarkedcatalogue')
export class BookmarkedCatalogue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Catalogue, (catalogue) => catalogue.user, {
    onDelete: 'CASCADE',
  })
  relCatalogue: Catalogue;

  @ManyToOne(() => User, (user) => user.boookmarkCatalogue)
  relUser: User;
}
