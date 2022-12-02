import { Request, Response } from 'express';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';

// Admin should be able to add user
// Admin should be able to update user details name, profile photo, mobile, whatsapp number, email, country, state, city, role, subrole, gst_number and verification document(s), company name, company address
// Admin should be able to delete user
// User should be able to add and edit catalogues
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

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const createdAdmin = await adminRepository
      .createQueryBuilder()
      .insert()
      .into(Admin)
      .values({ name: name, email: email, password: password })
      .returning('*')
      .execute();
    res.status(200).json({ data: createdAdmin.raw[0] });
  } catch (error) {
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};
const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    // console.log(id);
    // console.log(typeof id);
    if (id?.length && id.length >= 1) {
      const getAdmin = await adminRepository
        .createQueryBuilder('admin')
        .select()
        .where({ id: id })
        .getRawOne();
      res.status(200).json({ data: getAdmin });
    } else if (id === '') {
      res.status(400).json({ message: 'Enter proper Id' });
    } else {
      const getAdmin = await adminRepository
        .createQueryBuilder('admin')
        .select()
        .getMany();
      res.status(200).json({ data: getAdmin });
    }
  } catch (error) {
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};
export { createAdmin, getAllAdmin };
