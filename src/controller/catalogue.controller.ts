import { json, Request, Response } from 'express';
import { SubRole } from '../entities/SubRole.entity';
import { AppDataSource } from '../dataBaseConnection';
import { Catalogue } from '../entities/Catalogue.entity';
import { Company } from '../entities/Company.entity';
import { User } from '../entities/User.Entity';
import { Category } from '../entities/Category.entity';
import { UpdateDateColumn } from 'typeorm';
import { getAllAdmin } from './admin.controller';

const errorFunction = (error: any) => {
  const errors = {
    code: 400,
    error: {
      message: error.message,
    },
    message: 'Error has Occurred',
  };
  return errors;
};
const returnFunction = (_message: string) => {
  const message = {
    message: _message,
  };
  return message;
};

const catalogueRepository = AppDataSource.getRepository(Catalogue);
const subRoleRepository = AppDataSource.getRepository(SubRole);
const companyRepository = AppDataSource.getRepository(Company);
const userRepository = AppDataSource.getRepository(User);

const createCatalogue = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;
    console.log(user);

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const files = req?.files as Record<string, Express.Multer.File[]>;
    const pdf = files?.pdf?.[0];
    const previewImage = files?.previewImage?.[0];

    let companyOwner = null;
    let userOwner = null;

    if (isRole === 'company') {
      companyOwner = user?.userId;
    } else if (isRole === 'user') {
      userOwner = user?.userId;
    }
    console.log(userOwner);
    console.log(companyOwner);
    const { name, description, isPrivate, status, editCount } = req.body;
    // console.log(req.body);
    // console.log(req.files);
    // console.log(pdf);
    // console.log(previewImage)

    const createdCatalogue = await catalogueRepository
      .createQueryBuilder('catalogue')
      .insert()
      .into(Catalogue)
      .values({
        name: name,
        pdf: pdf,
        previewImage: previewImage,
        description: description,
        isPrivate: isPrivate,
        status: status,
        editCount: editCount,
        //@ts-ignore
        userOwner: userOwner,
        //@ts-ignore
        companyOwner: companyOwner,
      })
      .returning('*')
      .execute();
    return res.status(200).json({ data: createdCatalogue?.raw?.[0] });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const updateCatalogue = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;
    console.log(user);

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const files = req?.files as Record<string, Express.Multer.File[]>;
    const pdf = files?.pdf?.[0];
    const previewImage = files?.previewImage?.[0];

    const { catalogueId, name, description, isPrivate, status } = req.body;
    console.log(req.body);
    // console.log(req.files);
    // console.log(pdf);
    // console.log(previewImage)
    if (isRole === 'company') {
      const updatedCatalogue = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .set({
          name: name,
          // @ts-ignore
          pdf: pdf,
          previewImage: previewImage,
          description: description,
          isPrivate: isPrivate,
          status: status,
        })
        .where({
          id: catalogueId,
        })
        .andWhere({ companyOwner: user?.userId })
        .returning('*')
        .execute();
      return res.status(200).json({ data: updatedCatalogue?.raw?.[0] });
    } else if (isRole === 'user') {
      const updatedCatalogue = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .set({
          name: name,
          // @ts-ignore
          pdf: pdf,
          previewImage: previewImage,
          description: description,
          isPrivate: isPrivate,
          status: status,
        })
        .where({
          id: catalogueId,
        })
        .andWhere({ userOwner: user?.userId })
        .execute();
      return res.status(200).json({ data: updatedCatalogue?.raw?.[0] });
    }
    return;
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};
const getAllCatalogue = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;
    console.log(user);

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const getAllCatalogue = await catalogueRepository
      .createQueryBuilder()
      .select()
      .getMany();
    console.log(getAllCatalogue);
    return res.status(200).json({ data: getAllCatalogue });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const userCataloguePrivate = async (req: Request, res: Response) => {
  try {
    const { userId, catalogueId } = req.query;
    const { isPrivate } = req.body;
    const userExist = await userRepository
      .createQueryBuilder('user')
      .select()
      .where({ id: userId })
      .getRawOne();

    if (!userExist) {
      res.status(400).json(returnFunction('User Exist'));
    }
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

export {
  createCatalogue,
  updateCatalogue,
  userCataloguePrivate,
  companyCataloguePrivate,
  getAllCatalogue,
};
