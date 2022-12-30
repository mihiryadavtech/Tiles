import { Request, Response } from 'express';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Catalogue } from '../entities/Catalogue.entity';
import { Company } from '../entities/Company.entity';
import { SubRole } from '../entities/SubRole.entity';
import { User } from '../entities/User.Entity';
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

const messageFunction = (_message: string, _token?: string) => {
  const message = {
    message: _message,
    token: _token,
  };
  return message;
};

const adminRepository = AppDataSource.getRepository(Admin);
const catalogueRepository = AppDataSource.getRepository(Catalogue);
const subRoleRepository = AppDataSource.getRepository(SubRole);
const userRepository = AppDataSource.getRepository(User);
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
      return res.status(400).json(messageFunction('Admin already exists'));

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
      .json(messageFunction('Admin is created successfully ', token));
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
      return res.status(400).json(messageFunction("Admin doesn't exist "));
    }
    const hashPassword = adminExist?.password;
    const correctPassword = await bcrypt.compare(password, hashPassword);

    if (!correctPassword) {
      return res.status(400).json(messageFunction('Enter a proper password'));
    }

    const token = jwt.sign(
      { userId: adminExist?.id, role: 'admin' },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );

    return res
      .status(200)
      .json(messageFunction('User login successfully', token));
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    if (!user) {
      return res.status(400).json(messageFunction("User doesn't exist"));
    }
    const isRole = user?.role;

    if (!(isRole === 'admin')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
    }
    const getAllAdmin = await adminRepository
      .createQueryBuilder('admin')
      .select()
      .getMany();

    return res.status(200).json({ data: getAllAdmin });
  } catch (error) {
    console.log(error);
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const approveCatalogue = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    if (!user) {
      return res.status(400).json(messageFunction("User doesn't exist"));
    }
    const isRole = user?.role;

    if (!(isRole === 'admin')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
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
      return res.status(400).json(messageFunction("Catalogue doesn't exist"));
    }
    return res
      .status(400)
      .json(messageFunction('Admin  approved the catalogue'));
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};
const adminRegisterUser = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
    }
    const images = req?.files as Record<string, Express.Multer.File[]>;
    const profilePhoto = images?.profilePhoto?.[0];
    const visitingCard = images?.visitingCard?.[0];
    const verificationDoc = images?.verificationDoc;
    const {
      name,
      mobile,
      waMobile,
      email,
      password,
      country,
      state,
      city,
      role,
      gstNumber,
      companyName,
      companyAddress,
      companyWebsite,
      docType,
      verified,
      disabled,
      meta,
      subrole,
    } = req.body;
    const userExist = await userRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .orWhere({ mobile: mobile })
      .getOne();

    if (userExist) {
      return res.status(200).json(messageFunction('User Already Exist'));
    }
    const subRoleExist = await subRoleRepository
      .createQueryBuilder('subrole')
      .select()
      .where({ id: subrole })
      .getRawOne();

    if (!subRoleExist) {
      return res.status(400).json(messageFunction("Subrole doesn't Exist"));
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    const createdUser = await userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        name: name,
        profilePhoto: profilePhoto,
        mobile: mobile,
        waMobile: waMobile,
        email: email,
        password: hashPassword,
        country: country,
        state: state,
        city: city,
        role: role,
        gstNumber: gstNumber,
        companyName: companyName,
        companyAddress: companyAddress,
        companyWebsite: companyWebsite,
        docType: docType,
        visitingCard: visitingCard,
        //@ts-ignore
        verificationDoc: verificationDoc,
        verified: verified,
        disabled: disabled,
        meta: meta,
        lastSeen: new Date(),
        subrole: subrole,
      })
      .returning('*')
      .execute();

    const token = jwt.sign(
      { userId: createdUser?.raw?.[0]?.id, role: 'user' },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );
    return res
      .status(200)
      .json(messageFunction('User SignUp successfully', token));
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};
const adminUpdateUser = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
    }

    const images = req?.files as Record<string, Express.Multer.File[]>;
    const profilePhoto = images?.profilePhoto?.[0];
    const visitingCard = images?.visitingCard?.[0];
    const verificationDoc = images?.verificationDoc;
    const {
      userId,
      name,
      mobile,
      waMobile,
      email,
      country,
      state,
      city,
      role,
      gstNumber,
      companyName,
      companyAddress,
      companyWebsite,
      docType,
      verified,
      disabled,
      meta,
    } = req.body;
    const userExist = await userRepository
      .createQueryBuilder()
      .select()
      .where({
        id: userId,
      })
      .getOne();

    if (!userExist) {
      return res.status(400).json(messageFunction("User doesn't exist"));
    }
    const userData = await userRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .orWhere({
        mobile: mobile,
      })
      .getOne();
    if (userData) {
      return res
        .status(400)
        .json(messageFunction('Enter proper data for email or phoneNumber '));
    }

    const updatedUser = await AppDataSource.createQueryBuilder()
      .update(User)
      .set({
        name: name,
        profilePhoto: profilePhoto,
        mobile: mobile,
        waMobile: waMobile,
        email: email,
        country: country,
        state: state,
        city: city,
        role: role,
        gstNumber: gstNumber,
        companyName: companyName,
        companyAddress: companyAddress,
        companyWebsite: companyWebsite,
        visitingCard: visitingCard,
        docType: docType,
        verificationDoc: verificationDoc,
        verified: verified,
        disabled: disabled,
        meta: meta,
      })
      .where({ id: userId })
      .returning('*')
      .execute();
    return res
      .status(200)
      .json(messageFunction('User is updated successfully'));
  } catch (error) {
    console.log(error?.detail);
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};
const adminDeleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;
    if (!(isRole === 'admin')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
    }
    const { userId } = req.body;

    const userExist = await userRepository
      .createQueryBuilder()
      .select()
      .where({
        id: userId,
      })
      .getOne();

    if (!userExist) {
      return res.status(400).json(messageFunction("User doesn't exist"));
    }
    const deletedUser = await userRepository
      .createQueryBuilder('user')
      .softDelete()
      .from(User)
      .where({ id: userId })
      .returning('*')
      .execute();

    return res.status(200).json(messageFunction('User is deleted'));
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

export {
  createAdmin,
  getAllAdmin,
  loginAdmin,
  approveCatalogue,
  adminRegisterUser,
  adminUpdateUser,
  adminDeleteUser,
};
