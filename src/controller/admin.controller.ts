import { Request, Response } from 'express';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Catalogue } from '../entities/Catalogue.entity';
const saltRounds = 12;

const errorFunction = (error: any) => {
  const errors = {
    code: 400,
    error: {
      message: error.message,
    },
    message: 'Check entered data properly',
  };
  return errors;
};

const returnFunction = (_message: string) => {
  const message = {
    message: _message,
  };
  return message;
};

const adminRepository = AppDataSource.getRepository(Admin);
const catalogueRepository = AppDataSource.getRepository(Catalogue);

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const adminExist = await adminRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .getOne();
    if (adminExist)
      return res.status(400).json(returnFunction('Admin already exists'));

    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    const createdAdmin = await adminRepository
      .createQueryBuilder()
      .insert()
      .into(Admin)
      .values({ name: name, email: email, password: hashPassword })
      .returning('id,name,email')
      .execute();

    const token = jwt.sign(
      { userId: createdAdmin?.raw?.[0]?.id, role: 'admin' },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );
    return res
      .status(200)
      .json({ message: 'User SignUp successfully', token: token });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const adminExist = await adminRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .getOne();

    if (!adminExist) {
      return res.status(400).json(returnFunction("User doesn't exist"));
    }
    const hashPassword = adminExist?.password;
    const correctPassword = await bcrypt.compare(password, hashPassword);

    if (!correctPassword) {
      return res.status(400).json(returnFunction('Enter the proper password'));
    }

    const token = jwt.sign(
      { userId: adminExist?.id, role: 'admin' },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );

    return res
      .status(200)
      .json({ message: 'User login successfully', token: token });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin')) {
      return res.json({ message: 'User is unauthorized' });
    }
    const getAllAdmin = await adminRepository
      .createQueryBuilder('admin')
      .select()
      .getMany();

    return res.status(200).json({ data: getAllAdmin });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const approveCatalogue = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const { catalogueId, status } = req.body;
    const approvedCatalogue = await catalogueRepository
      .createQueryBuilder()
      .update(Catalogue)
      .set({
        status: status,
      })
      .where({ id: catalogueId })
      .returning('*')
      .execute();
    if (!approvedCatalogue?.affected) {
      return res.status(200).json({ message: 'Enter proper data' });
    }
    return res.status(200).json({ data: approvedCatalogue?.raw?.[0] });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

export { createAdmin, getAllAdmin, loginAdmin, approveCatalogue };
