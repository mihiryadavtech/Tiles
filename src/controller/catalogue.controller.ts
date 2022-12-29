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

    const { name, description, isPrivate, status, editCount } = req.body;

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
        userOwner: userOwner,
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

// update the Catalogue

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

    if (isRole === 'company') {
      console.log('>>>>>company');
      const updatedCatalogue = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .set({
          name: name,
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
      console.log('>>>>>>>', updatedCatalogue?.raw?.[0]);

      if (!updatedCatalogue?.affected) {
        return res.status(400).json({ message: 'Enter proper catalogueId' });
      }
      return res.status(200).json({ data: updatedCatalogue?.raw?.[0] });
    } else {
      console.log('>>>>>user');

      const updatedCatalogue = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .set({
          name: name,
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
        .returning('*')
        .execute();
      console.log('++++++', updatedCatalogue);

      if (!updatedCatalogue?.affected) {
        return res.status(400).json({ message: 'Enter proper catalogueId' });
      }
      return res.status(200).json({ data: updatedCatalogue?.raw?.[0] });
    }
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

    if (!(isRole === 'company' || isRole === 'user' || isRole === 'admin')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const getAllCatalogue = await catalogueRepository
      .createQueryBuilder()
      .select()
      .getMany();
    return res.status(200).json({ data: getAllCatalogue });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

// delete the catalogue
const deleteCatalogue = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;
    console.log(user);

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const { catalogueId } = req.body;
    console.log(req.body);

    if (isRole === 'company') {
      const deletedCatalogue = await catalogueRepository
        .createQueryBuilder()
        .delete()
        .where({
          id: catalogueId,
        })
        .andWhere({ companyOwner: user?.userId })
        .returning('*')
        .execute();

      if (!deletedCatalogue?.affected) {
        return res.status(400).json({ message: 'Enter proper catalogueId' });
      }
      return res
        .status(200)
        .json({ message: 'Catalogue deleted successfully' });
    } else {
      const deletedCatalogue = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .delete()
        .where({
          id: catalogueId,
        })
        .andWhere({ userOwner: user?.userId })
        .returning('*')
        .execute();
      console.log(deletedCatalogue);
      if (!deletedCatalogue?.affected) {
        return res.status(400).json({ message: 'Enter proper catalogueId' });
      }
      return res
        .status(200)
        .json({ message: 'Catalogue deleted successfully' });
    }
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

// catalogue private
const cataloguePrivate = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;
    console.log(user);

    const { catalogueId, isPrivate } = req.body;
    console.log(req.body);

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }

    if (isRole === 'company') {
      const updatedCataloguePrivate = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .set({
          isPrivate: isPrivate,
        })
        .where({ id: catalogueId })
        .andWhere({
          companyOwner: user?.userId,
        })
        .returning('*')
        .execute();

      if (!updatedCataloguePrivate?.affected) {
        return res.status(400).json({ message: 'Enter proper catalogueId' });
      }
      return res.status(200).json({ data: updatedCataloguePrivate?.raw?.[0] });
    } else {
      const updatedCataloguePrivate = await catalogueRepository
        .createQueryBuilder()
        .update(Catalogue)
        .set({
          isPrivate: isPrivate,
        })
        .where({ id: catalogueId })
        .andWhere({
          userOwner: user?.userId,
        })
        .returning('*')
        .execute();

      if (!updatedCataloguePrivate?.affected) {
        return res.status(400).json({ message: 'Enter proper catalogueId' });
      }
      return res.status(200).json({ data: updatedCataloguePrivate?.raw?.[0] });
    }
  } catch (error) {
    console.log(error);
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

export {
  createCatalogue,
  updateCatalogue,
  cataloguePrivate,
  getAllCatalogue,
  deleteCatalogue,
};
