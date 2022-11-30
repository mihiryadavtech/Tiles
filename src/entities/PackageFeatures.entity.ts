import file from 'src/interfaces/file';

enum Features {
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
import { Package } from './Package.entity';

@Entity('packagefeatures')
export class PackageFeatures extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'feature',
    type: 'enum',
    enum: Features,
    default: Features.INREVIEW,
  })
  feature: Features;

  @Column({ name: 'title', type: 'varchar', length: 150 })
  title: string;

  @Column({ name: 'description', type: 'varchar', length: 500 })
  description: string;

  @Column({ name: 'status', type: 'boolean' })
  status: boolean;

  @Column({ name: 'limit', type: 'int' })
  limit: number;

  @ManyToOne(() => Package, (packages) => packages.packageFeatures)
  package: Package;
}
