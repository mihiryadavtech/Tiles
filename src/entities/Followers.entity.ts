
import {
  BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User.entity';

@Entity('followers')
export class Followers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.followsWhom)
  byWhom: User;

  @ManyToOne(() => User, (user) => user.followsTo)
  toWhom: User;
}
