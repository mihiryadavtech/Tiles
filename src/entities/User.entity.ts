import file from 'src/types/file';
enum Role {
  BUYER = 1,
  SELLER = 2,
}
enum Doc {
  ADHAAR = 1,
  PAN_CARD = 2,
}

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookmarkedCatalogue } from './BookmarkedCatalogue.entity';
import { Catalogue } from './Catalogue.entity';
import { CatalogueViewer } from './CatalogueViewer.entity';
import { CompanyViewCount } from './CompanyViewCount.entity';
import { Contact } from './Contact.entity';
import { Followers } from './Followers.entity';
import { LikePosts } from './LikePosts.entity';
import { Post } from './Post.entity';
import { PostViewer } from './PostViewer.entity';
import { PrivateCataloguePermission } from './PrivateCataloguePermission.entity';
import { ReportedPosts } from './ReportedPosts.entity';
import { SubRole } from './SubRole.entity';
import { Subscription } from './Subscription.entity';
import { UserDealingCategory } from './UserDealingcategory.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'profile_photo', type: 'jsonb', nullable: true })
  profilePhoto: file;

  @Column({ name: 'mobile', type: 'varchar', length: 15, unique: true })
  mobile: number;

  @Column({ name: 'wa_mobile', type: 'varchar', length: 15, nullable: true })
  waMobile: number;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ name: 'country', type: 'varchar' })
  country: string;

  @Column({ name: 'state', type: 'varchar' })
  state: string;

  @Column({ name: 'city', type: 'varchar' })
  city: string;

  @Column({ name: 'role', type: 'enum', enum: Role, default: Role.BUYER })
  role: Role;

  @Column({ name: 'gst_number', type: 'varchar', length: 15, nullable: true })
  gstNumber: number;

  @Column({
    name: 'company_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  companyName: string;

  @Column({
    name: 'company_address',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  companyAddress: string;

  @Column({ name: 'company_website', type: 'varchar', nullable: true })
  companyWebsite: string;

  @Column({ name: 'visiting_card', type: 'jsonb', nullable: true })
  visitingCard: file;

  @Column({
    name: 'doc_type',
    type: 'enum',
    enum: Doc,
    default: Doc.ADHAAR,
    nullable: true,
  })
  docType: Doc;

  @Column({ name: 'verification_doc', type: 'jsonb', nullable: true })
  verificationDoc: file;

  @Column({ name: 'verified', type: 'boolean' })
  verified: boolean;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @Column({ name: 'last_seen', type: 'timestamp' })
  lastSeen: Date;

  @Column({ name: 'meta', type: 'jsonb', nullable: true })
  meta: {};

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt?: Date;

  @ManyToOne(() => SubRole, (subRole) => subRole.user)
  subrole: SubRole;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscription: Subscription[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(
    () => CompanyViewCount,
    (companyViewCount) => companyViewCount.user
  )
  companyViewCount: CompanyViewCount[];

  @OneToMany(() => ReportedPosts, (reportedPosts) => reportedPosts.user)
  reportedPosts: ReportedPosts[];

  @OneToMany(() => Catalogue, (catalogue) => catalogue.userOwner, {
    onDelete: 'CASCADE',
  })
  catalogue: Catalogue[];

  @OneToMany(() => Contact, (contact) => contact.user)
  contact: Contact[];

  @OneToMany(
    () => UserDealingCategory,
    (userDealingCategory) => userDealingCategory.relUser
  )
  category: UserDealingCategory[];

  @OneToMany(
    () => BookmarkedCatalogue,
    (bookmarkedcatalogue) => bookmarkedcatalogue.relUser
  )
  boookmarkCatalogue: BookmarkedCatalogue[];

  @OneToMany(
    () => PrivateCataloguePermission,
    (privateCataloguePermission) => privateCataloguePermission.relUser
  )
  privateCatalogue: PrivateCataloguePermission[];

  @OneToMany(
    () => CatalogueViewer,
    (catalogueViewer) => catalogueViewer.relUser
  )
  catalogueViewer: CatalogueViewer[];

  @OneToMany(() => PostViewer, (postViewer) => postViewer.relUser)
  postViewer: PostViewer[];

  @OneToMany(() => LikePosts, (likePosts) => likePosts.relUser)
  postLike: LikePosts[];

  @OneToMany(() => Followers, (followers) => followers.toWhom)
  followsWhom: Followers[];

  @OneToMany(() => Followers, (followers) => followers.byWhom)
  followsTo: Followers[];
}
