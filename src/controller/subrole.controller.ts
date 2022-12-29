import { Request, Response } from 'express';
import { SubRole } from '../entities/SubRole.entity';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';

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

const adminRepository = AppDataSource.getRepository(Admin);
const subRoleRepository = AppDataSource.getRepository(SubRole);

const createSubrole = async (req: Request, res: Response) => {
  try {
    const { name, slug, disabled, isDeletable } = req.body;

    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const createdSubrole = await adminRepository
      .createQueryBuilder()
      .insert()
      .into(SubRole)
      .values({
        name: name,
        slug: slug,
        disabled: disabled,
        isDeletable: isDeletable,
        admin: user?.userId,
      })
      .returning('*')
      .execute();

    return res.status(200).json({ data: createdSubrole?.raw?.[0] });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const getAllSubrole = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const allSubrole = await subRoleRepository
      .createQueryBuilder('subrole')
      .select()
      .getMany();
    return res.status(200).json({ data: allSubrole });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};
export { createSubrole, getAllSubrole };
