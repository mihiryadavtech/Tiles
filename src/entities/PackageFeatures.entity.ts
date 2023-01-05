import {
  BaseEntity,
  Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Package } from './Package.entity';

enum Features {
  INREVIEW = 0,
  APPROVED = 1,
  REJECTED = 2,
}

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
