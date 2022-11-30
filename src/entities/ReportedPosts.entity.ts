import file from 'src/interfaces/file';
enum Status {
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  INREVIEW = 'InReview',
}

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
