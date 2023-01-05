
enum Config {
  CERAMIC = 'Ceramic_tiles_form',
  SENITARY = 'Sanitary_tiles_form',
  BOTH = 'Both',
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
  OneToMany,
} from 'typeorm';
import { Admin } from './Admin.entity';
import { PostFeatures } from './PostFeatures.entity';

@Entity('features')
export class Features extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'disabled', type: 'boolean' })
  disabled: boolean;

  @Column({
    name: 'config',
    type: 'enum',
    enum: Config,
    default: Config.CERAMIC,
  })
  config: Config;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.features)
  admin: Admin;

  @OneToMany(() => PostFeatures, (postFeatures) => postFeatures.relFeature)
  post: PostFeatures[];
}
