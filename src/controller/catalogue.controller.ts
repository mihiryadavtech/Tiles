import { json, Request, Response } from 'express';
import { SubRole } from '../entities/SubRole.entity';
import { AppDataSource } from '../dataBaseConnection';
import { Catalogue } from '../entities/Catalogue.entity';
import { Company } from '../entities/Company.entity';
import { User } from '../entities/User.Entity';
import { Category } from '../entities/Category.entity';

const errorFunction = (error: any) => {
  const errors = {
    code: 400,
    error: {
      message: error.message,
    },
    message: ' Somekind Of Error',
  };
  return errors;
};

const catalogueRepository = AppDataSource.getRepository(Catalogue);
const subRoleRepository = AppDataSource.getRepository(SubRole);
const companyRepository = AppDataSource.getRepository(Company);
const userRepository = AppDataSource.getRepository(User);

const userCataloguePrivate = async (req: Request, res: Response) => {
  try {
    const { userId, catalogueId } = req.query;
    const { isPrivate } = req.body;
    const userExist = await userRepository
      .createQueryBuilder('user')
      .select()
      .where({ id: userId })
      .getRawOne();

    if (userExist) {
      const cataloguePrivate = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .set({
          isPrivate: isPrivate,
        })
        .where({ id: catalogueId })
        .andWhere({
          userOwner: userExist.user_id,
        })
        .returning('*')
        .execute();
      res.status(200).json({ data: cataloguePrivate.raw[0] });
    } else {
      res.status(400).json('User not Exist');
    }
  } catch (error) {
    console.log(error);
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

const companyCataloguePrivate = async (req: Request, res: Response) => {
  try {
    const { companyId, catalogueId } = req.query;
    const { isPrivate } = req.body;
    const companyExist = await companyRepository
      .createQueryBuilder('company')
      .select()
      .where({ id: companyId })
      .getRawOne();

    if (companyExist) {
      const cataloguePrivate = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .set({
          isPrivate: isPrivate,
        })
        .where({ id: catalogueId })
        .andWhere({
          companyOwner: companyExist.company_id,
        })
        .returning('*')
        .execute();
      res.status(200).json({ data: cataloguePrivate.raw[0] });
    } else {
      res.status(400).json('Company not Exist');
    }
  } catch (error) {
    console.log(error);
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};


export { userCataloguePrivate, companyCataloguePrivate };
