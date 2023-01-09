enum Status {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}

import {
  BaseEntity,
  Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Entity('reportedposts')
export class ReportedPosts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'reason',
    type: 'enum',
    enum: Status,
    default: Status.INREVIEW,
  })
  config: Status;

  @Column({ name: 'name', type: 'varchar', length: 200 })
  name: string;

  @ManyToOne(() => Post, (post) => post.reportedPosts)
  post: Post;

  @ManyToOne(() => User, (user) => user.reportedPosts)
  user: User;
}
