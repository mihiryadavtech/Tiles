import file from 'src/interfaces/file';
enum Role {
  BUYER = 'Buyer',
  SELLER = 'Seller',
}
enum Doc {
  ADHAAR = 'Adhaar',
  PAN_CARD = 'Pan_card',
}

import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Timestamp,
  OneToOne,
  JoinColumn,
  OneToMany,
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

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'profile_photo', type: 'jsonb', nullable: true })
  profilePhoto: file;

  @Column({ type: 'varchar', length: 15 })
  mobile: number;

  @Column({ name: 'wa_mobile', type: 'varchar', length: 15, nullable: true })
  waMobile: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'enum', enum: Role, default: Role.BUYER })
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

  @Column({ name: 'visiting_card', type: 'varchar', nullable: true })
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

  @Column({ type: 'boolean' })
  verified: boolean;

  @Column({ type: 'boolean' })
  disabled: boolean;

  @Column({ type: 'timestamptz', name: 'last_seen' })
  lastSeen: Date;

  @Column({ type: 'jsonb', nullable: true })
  meta: () => {};

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => SubRole, (subRole) => subRole.user)
  @JoinColumn()
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

  @OneToMany(() => Catalogue, (catalogue) => catalogue.userOwner)
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
  privateCatelogue: PrivateCataloguePermission[];

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
