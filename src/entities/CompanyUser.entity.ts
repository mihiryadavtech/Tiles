
import {
  BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Company } from './Company.entity';
import { Contact } from './Contact.entity';

@Entity('companyuser')
export class CompanyUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.contact)
  relCompany: Company;

  @ManyToOne(() => Contact, (contact) => contact.company)
  relContact: Contact;
}
