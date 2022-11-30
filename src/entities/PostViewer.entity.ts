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

import { Post } from './Post.entity';
import { User } from './User.Entity';

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
