import file from 'src/types/file';
enum Status {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Admin } from './Admin.entity';
import { BookmarkedCatalogue } from './BookmarkedCatalogue.entity';
import { CatalogueSizes } from './CatalogueSizes.entity';
import { CatalogueViewer } from './CatalogueViewer.entity';
import { Category } from './Category.entity';
import { Company } from './Company.entity';
import { PrivateCataloguePermission } from './PrivateCataloguePermission.entity';
import { User } from './User.entity';

@Entity('catalogue')
export class Catalogue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'pdf', type: 'jsonb' })
  pdf: file;

  @Column({ name: 'preview_image', type: 'jsonb', nullable: true })
  previewImage: file;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ name: 'is_private', type: 'boolean' })
  isPrivate: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.INREVIEW,
  })
  status: Status;

  @Column({ name: 'edit_count', type: 'int' })
  editCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.catalogue)
  admin: Admin;

  @ManyToOne(() => Category, (category) => category.catalogue)
  category: Category;

  @ManyToOne(() => User, (user) => user.catalogue, { onDelete: 'CASCADE' })
  userOwner: User;

  @ManyToOne(() => Company, (company) => company.catalogue)
  companyOwner: Company;

  @OneToMany(
    () => CatalogueSizes,
    (cataloguesizes) => cataloguesizes.relCatalogue
  )
  size: CatalogueSizes[];

  @OneToMany(
    () => BookmarkedCatalogue,
    (bookMarkedCatalogue) => bookMarkedCatalogue.relCatalogue,
    { onDelete: 'CASCADE' }
  )
  user: CatalogueSizes[];

  @OneToMany(
    () => PrivateCataloguePermission,
    (privateCataloguePermission) => privateCataloguePermission.relCatalogue,
    { onDelete: 'CASCADE' }
  )
  privateUser: CatalogueSizes[];

  @OneToMany(
    () => CatalogueViewer,
    (catalogueViewer) => catalogueViewer.relCatalogue
  )
  userViewer: CatalogueSizes[];
}
