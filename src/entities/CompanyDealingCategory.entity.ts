
import {
  BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Category } from './Category.entity';
import { Company } from './Company.entity';
import { Type } from './Type.entity';
@Entity('companydealingcategory')
export class CompanyDealingCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.CompanyDealingCategory)
  company: Company;

  @ManyToOne(() => Type, (type) => type.CompanyDealingCategory)
  type: Type;

  @ManyToOne(() => Category, (category) => category.CompanyDealingCategory)
  category: Category;
}
