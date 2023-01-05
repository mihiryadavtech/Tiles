
import {
  BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { AttributesValues } from './AttributesValues.entity';
import { Product } from './Product.entity';

@Entity('productattributes')
export class ProductAttributes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.attributeValue)
  relProduct: Product;

  @ManyToOne(
    () => AttributesValues,
    (attributesValues) => attributesValues.product
  )
  relAttribute: AttributesValues;
}
