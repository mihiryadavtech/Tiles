
import {
  BaseEntity,
  Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { Post } from './Post.entity';
import { User } from './User.entity';

@Entity('postviewer')
export class PostViewer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'count', type: 'bigint' })
  count: bigint;

  @ManyToOne(() => Post, (post) => post.userViewer)
  relPost: Post;

  @ManyToOne(() => User, (user) => user.postViewer)
  relUser: User;
}
