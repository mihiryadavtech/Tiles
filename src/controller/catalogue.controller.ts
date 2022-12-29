import { Request, Response } from 'express';
import { AppDataSource } from '../dataBaseConnection';
import { Catalogue } from '../entities/Catalogue.entity';
import { Company } from '../entities/Company.entity';
import { PrivateCataloguePermission } from '../entities/PrivateCataloguePermission.entity';
import { User } from '../entities/User.Entity';

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
const privateCataloguePermissionRepository = AppDataSource.getRepository(
  PrivateCataloguePermission
);
const companyRepository = AppDataSource.getRepository(Company);
const userRepository = AppDataSource.getRepository(User);

const createCatalogue = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

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

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const files = req?.files as Record<string, Express.Multer.File[]>;
    const pdf = files?.pdf?.[0];
    const previewImage = files?.previewImage?.[0];

    const { catalogueId, name, description, isPrivate, status } = req.body;

    if (isRole === 'company') {
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

      if (!updatedCatalogue?.affected) {
        return res.status(400).json({ message: 'Enter proper catalogueId' });
      }
      return res.status(200).json({ data: updatedCatalogue?.raw?.[0] });
    } else {

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

    if (!(isRole === 'company' || isRole === 'user' || isRole === 'admin')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const getAllCatalogue = await catalogueRepository
      .createQueryBuilder()
      .select()
      .where({
        isPrivate: false,
      })
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

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }
    const { catalogueId } = req.body;

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

    const { catalogueId, isPrivate } = req.body;

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
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

//Owners can give viewing private catalogue permission to other users
const privateCataloguePermission = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    const { catalogueId, userId } = req.body;

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.status(400).json({ message: 'User is unauthorized' });
    }
    const catalogueExist = await catalogueRepository
      .createQueryBuilder('catalogue')
      .select()
      .where({ id: catalogueId })
      .orWhere({
        userOwner: user?.userId,
      })
      .orWhere({
        companyOwner: user?.userId,
      })
      .getRawOne();

    const userExist = await userRepository
      .createQueryBuilder()
      .select()
      .where({ id: userId })
      .getOne();

    if (!(catalogueExist && userExist)) {
      return res
        .status(400)
        .json({ message: "Catalogue or User doesn't Exist" });
    }

    const updatedCataloguePrivate = await privateCataloguePermissionRepository
      .createQueryBuilder('catalogue')
      .insert()
      .into(PrivateCataloguePermission)
      .values({
        status: catalogueExist?.catalogue_status,
        relCatelogue: catalogueExist?.catalogue_id,
        relUser: userId,
      })
      .returning('*')
      .execute();

    return res.status(200).json({
      message: 'Private Acess given to the User',
      data: updatedCataloguePrivate?.raw?.[0],
    });
  } catch (error) {
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
  privateCataloguePermission,
};
