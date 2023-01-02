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
const messageFunction = (_message: string) => {
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
    if (!user) {
      return res.status(400).json(messageFunction("User doesn't Exist"));
    }
    const isRole = user?.role;
    if (!(isRole === 'company' || isRole === 'user')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
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
    return res
      .status(200)
      .json(messageFunction('Catalogue is created successfully '));
  } catch (error) {
    return res.status(400).json(errorFunction(error));
  }
};

// update the Catalogue

const updateCatalogue = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'company' || isRole === 'user')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
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
        return res
          .status(400)
          .json(messageFunction("CatalogueId doesn't belong to you "));
      }
      return res
        .status(200)
        .json(messageFunction('Catalogue updated successfully'));
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
        return res
          .status(400)
          .json(messageFunction("CatalogueId doesn't belong to you "));
      }
      return res
        .status(200)
        .json(messageFunction('Catalogue updated successfully'));
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
      return res.status(400).json(messageFunction('User is unauthorized'));
    }

    const getAllCatalogue = await catalogueRepository
      .createQueryBuilder()
      .select()
      .where({
        isPrivate: false,
      })
      .getMany();
    if (!getAllCatalogue?.length) {
      return res
        .status(200)
        .json(messageFunction('No catalog available to show'));
    }

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
      return res.status(400).json(messageFunction('User is unauthorized'));
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
        return res
          .status(400)
          .json(messageFunction("CatalogueId doesn't own by you "));
      }
      return res
        .status(200)
        .json(messageFunction('Catalogue deleted successfully'));
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
        return res
          .status(400)
          .json(messageFunction("CatalogueId doesn't own by you "));
      }
      return res
        .status(200)
        .json(messageFunction('Catalogue deleted successfully'));
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
      return res.status(400).json(messageFunction('User is unauthorized'));
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
        return res
          .status(400)
          .json(messageFunction("Catalogue doesn't own by you "));
      }
      return res
        .status(200)
        .json(messageFunction('Your catalog is made Private'));
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
        return res
          .status(400)
          .json(messageFunction("Catalogue doesn't own by you "));
      }
      return res
        .status(200)
        .json(messageFunction('Your catalog is made Private'));
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
      return res.status(400).json(messageFunction('User is unauthorized'));
    }
    const userExist = await userRepository
      .createQueryBuilder()
      .select()
      .where({ id: userId })
      .getOne();
    if (!userExist) {
      return res
        .status(400)
        .json(messageFunction("Mentioned user doesn't Exist"));
    }

    if (isRole === 'company') {
      const catalogueExist = await catalogueRepository
        .createQueryBuilder('catalogue')
        .select()
        .where({ id: catalogueId })
        .andWhere({
          companyOwner: user?.userId,
        })
        .getRawOne();
      if (!catalogueExist) {
        return res
          .status(400)
          .json(messageFunction("Mentioned Catalogue doesn't own by you"));
      }
      const updatedCataloguePrivate = await privateCataloguePermissionRepository
        .createQueryBuilder('catalogue')
        .insert()
        .into(PrivateCataloguePermission)
        .values({
          status: catalogueExist?.catalogue_status,
          relCatalogue: catalogueExist?.catalogue_id,
          relUser: userId,
        })
        .returning('*')
        .execute();

      return res
        .status(400)
        .json(messageFunction('Private Access given to the User'));
    } else {
      const catalogueExist = await catalogueRepository
        .createQueryBuilder('catalogue')
        .select()
        .where({ id: catalogueId })
        .andWhere({
          userOwner: user?.userId,
        })
        .getRawOne();
      if (!catalogueExist) {
        return res
          .status(400)
          .json(messageFunction("Mentioned Catalogue doesn't own by you"));
      }
      const updatedCataloguePrivate = await privateCataloguePermissionRepository
        .createQueryBuilder('catalogue')
        .insert()
        .into(PrivateCataloguePermission)
        .values({
          status: catalogueExist?.catalogue_status,
          relCatalogue: catalogueExist?.catalogue_id,
          relUser: userId,
        })
        .returning('*')
        .execute();

      return res
        .status(400)
        .json(messageFunction('Private Access given to the User'));
    }
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
