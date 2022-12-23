import { Request, Response } from 'express';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 12;

const errorFunction = (error: any) => {
  const errors = {
    code: 400,
    error: {
      message: error.message,
    },
    message: 'Check entered data  properly',
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

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    const adminExist = await adminRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .getOne();
    console.log(adminExist);
    if (!adminExist) {
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
        { userId: createdAdmin?.raw?.[0]?.id, role: 'Admin' },
        process.env.TOKEN_KEY as string,
        { expiresIn: '1h' }
      );
      // console.log(token);
      return res.status(200).json({ data: createdAdmin?.raw?.[0] });
    }
    return res.status(400).json(returnFunction('User already exist'));
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

    console.log(adminExist?.password);
    if (!adminExist) {
      return res.status(400).json(returnFunction("User doesn't exist"));
    }
    const hashPassword = adminExist?.password;
    const correctPassword = await bcrypt.compare(password, hashPassword);
    // console.log(correctPassword);
    if (!correctPassword) {
      return res.status(400).json(returnFunction('Enter the proper password'));
    }

    const token = jwt.sign(
      { userId: adminExist?.id, role: 'Admin' },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );
    // console.log(token);
    // console.log(process.env.TOKEN_KEY);

    return res
      .status(400)
      .json({ message: 'User login successfully', token: token });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isAdmin = user?.role;
    console.log(Boolean(isAdmin));

    if (!(isAdmin === 'Admin')) {
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
export { createAdmin, getAllAdmin, loginAdmin };
