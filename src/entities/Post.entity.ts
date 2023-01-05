import file from 'src/types/file';

enum Status {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AreaType } from './AreaType.entity';
import { Category } from './Category.entity';
import { Grade } from './Grade.entity';
import { LikePosts } from './LikePosts.entity';
import { PostFeatures } from './PostFeatures.entity';
import { PostViewer } from './PostViewer.entity';
import { QuantityType } from './QuantityType.entity';
import { ReportedPosts } from './ReportedPosts.entity';
import { SalesType } from './SalesType.entity';
import { Size } from './Size.entity';
import { Unit } from './Unit.entity';
import { User } from './User.Entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'post_type',
    type: 'enum',
    enum: Status,
    default: Status.INREVIEW,
  })
  postType: Status;

  @Column({ name: 'image', type: 'jsonb' })
  image: file;

  @Column({ name: 'quantity', type: 'decimal', nullable: true })
  quantity: number;

  @Column({ name: 'quantity_as_required', type: 'boolean', nullable: true })
  quantityAsRequired: boolean;

  @Column({ name: 'price', type: 'decimal', nullable: true })
  price: number;

  @Column({
    name: 'currency_type',
    type: 'enum',
    enum: Status,
    default: Status.INREVIEW,
    nullable: true,
  })
  currencyType: Status;

  @Column({ name: 'tax_included', type: 'boolean', nullable: true })
  taxIncluded: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.INREVIEW,
  })
  status: Status;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ name: 'sponsored', type: 'boolean' })
  sponsored: boolean;

  @Column({ name: 'edit_count', type: 'int' })
  editCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.post)
  user: User;

  @ManyToOne(() => SalesType, (salesType) => salesType.post)
  salesType: SalesType;

  @ManyToOne(() => Category, (category) => category.post)
  category: Category;

  @ManyToOne(() => Size, (size) => size.post)
  size: Size;

  @ManyToOne(() => Unit, (unit) => unit.post)
  unit: Unit;

  @ManyToOne(() => QuantityType, (quantityType) => quantityType.post)
  quantityType: QuantityType;

  @ManyToOne(() => AreaType, (areaType) => areaType.post)
  areaType: AreaType;

  @ManyToOne(() => Grade, (grade) => grade.post)
  grade: Grade;

  @OneToMany(() => ReportedPosts, (reportedPosts) => reportedPosts.post)
  reportedPosts: ReportedPosts[];

  @OneToMany(() => PostFeatures, (postFeatures) => postFeatures.relPost)
  feature: PostFeatures[];

  @OneToMany(() => PostViewer, (postviewer) => postviewer.relPost)
  userViewer: PostViewer[];

  @OneToMany(() => LikePosts, (likePosts) => likePosts.relPost)
  userLike: LikePosts[];
}
