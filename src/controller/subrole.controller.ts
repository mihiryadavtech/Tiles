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
    message: ' Somekind Of Error',
  };
  return errors;
};

const adminRepository = AppDataSource.getRepository(Admin);
const subRoleRepository = AppDataSource.getRepository(SubRole);

const createSubrole = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.query;

    const adminExist = await adminRepository
      .createQueryBuilder('admin')
      .select()
      .where({ id: adminId })
      .getRawOne();

    if (adminExist) {
      const { name, slug, disabled, isDeletable } = req.body;
      const createdSubrole = await adminRepository
        .createQueryBuilder()
        .insert()
        .into(SubRole)
        .values({
          name: name,
          slug: slug,
          disabled: disabled,
          isDeletable: isDeletable,
          admin: adminExist.admin_id,
        })
        .returning('*')
        .execute();

      res.status(200).json({ data: createdSubrole.raw[0] });
    } else {
      res.status(400).json({ message: 'Admin not exist' });
    }
  } catch (error) {
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

const getAllSubrole = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (id?.length && id.length >= 1) {
      const getSubrole = await subRoleRepository
        .createQueryBuilder('subrole')
        .select()
        .where({ id: id })
        .getOne();
      res.status(200).json({ data: getSubrole });
    } else if (id === '') {
      res.status(400).json({ message: 'Enter proper Id' });
    } else {
      const getSubrole = await subRoleRepository
        .createQueryBuilder('subrole')
        .select()
        .getMany();
      res.status(200).json({ data: getSubrole });
    }
  } catch (error) {
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};
export { createSubrole, getAllSubrole };
