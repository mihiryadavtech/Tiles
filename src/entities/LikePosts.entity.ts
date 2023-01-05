
import {
  BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Post } from './Post.entity';
import { User } from './User.Entity';

@Entity('likeposts')
export class LikePosts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.userLike)
  relPost: Post;

  @ManyToOne(() => User, (user) => user.postLike)
  relUser: User;
}
