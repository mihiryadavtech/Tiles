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
import { Admin } from './Admin.entity';
import { Features } from './Features.entity';
import { Post } from './Post.entity';

@Entity('postfeatures')
export class PostFeatures extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.feature)
  relPost: Post;

  @ManyToOne(() => Features, (features) => features.post)
  relFeature: Post;
}
