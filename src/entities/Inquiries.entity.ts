import file from 'src/interfaces/file';

enum Inquiry_type {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Timestamp,
  OneToMany,
} from 'typeorm';
import { Category } from './Category.entity';
import { Post } from './Post.entity';

@Entity('inquiries')
export class Inquiries extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'inquiry_type',
    type: 'enum',
    enum: Inquiry_type,
    default: Inquiry_type.INREVIEW,
  })
  inquiryType: Inquiry_type;

  @Column({ name: 'details', type: 'jsonb' })
  details: {};

  @OneToMany(() => Category, (category) => category.inquiries)
  category: Category[];

  @OneToMany(() => Post, (post) => post.grade)
  post: Post[];
  // For whom and By whom
  // @OneToMany(() => , (post) => post.grade)
  // post: Post[];
}
