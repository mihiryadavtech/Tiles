import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../exceptions/errorException';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';
import { Catalogue } from '../entities/Catalogue.entity';
import { Company } from '../entities/Company.entity';
import { SubRole } from '../entities/SubRole.entity';
const saltRounds = 12;

const errorFunction = (error: any) => {
  const errors = {
    code: 400,
    error: {
      message: error.message,
    },
    message: 'Error has happened',
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
const subRoleRepository = AppDataSource.getRepository(SubRole);
const companyRepository = AppDataSource.getRepository(Company);
const catalogueRepository = AppDataSource.getRepository(Catalogue);

const registerCompany = async (req: Request, res: Response) => {
  try {
    const images = req?.files as Record<string, Express.Multer.File[]>;
    const logo = images?.logo?.[0];
    const cta = images?.cta?.[0];

    const {
      name,
      mobile,
      email,
      password,
      website,
      address,
      latitude,
      longitude,
      sponsored,
      verified,
      disabled,
      description,
      subrole,
      admin,
    } = req.body;

    const companyExist = await companyRepository
      .createQueryBuilder('company')
      .select()
      .where({ email: email })
      .getOne();

    if (companyExist) {
      return res.status(400).json(messageFunction('Company Already Exist'));
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

    const registeredCompany = await companyRepository
      .createQueryBuilder()
      .insert()
      .into(Company)
      .values({
        logo: logo,
        name: name,
        mobile: mobile,
        email: email,
        password: hashPassword,
        website: website,
        address: address,
        latitude: latitude,
        longitude: longitude,
        sponsored: sponsored,
        verified: verified,
        disabled: disabled,
        cta: cta,
        description: description,
        // admin: user.user_id,
        subrole: subRoleExist?.subrole_id,
      })
      .returning('*')
      .execute();
    return res
      .status(200)
      .json(messageFunction('Registered company successfully'));
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const loginCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const companyExist = await companyRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .getOne();

    if (!companyExist) {
      return res
        .status(400)
        .json(messageFunction("Company User doesn't exist"));
    }
    const hashPassword = companyExist?.password;
    const correctPassword = await bcrypt.compare(password, hashPassword);
    if (!correctPassword) {
      throw new AppError("Enter password doesn't match", 401);
      // return res
      //   .status(400)
      //   .json(messageFunction("Enter password doesn't match"));
    }

    const token = jwt.sign(
      { userId: companyExist?.id, role: 'company' },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );
    return res
      .status(200)
      .json(messageFunction('Company User login successfully', token));
  } catch (error) {
    console.log('>>>>>///', error);
    return next(error);
    // const errors = errorFunction(error);
    // return res.status(400).json({ errors });
  }
};

const getAllCompany = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin' || isRole === 'company')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
    }
    const allCompany = await companyRepository
      .createQueryBuilder('company')
      .select()
      .getRawMany();
    let allCompanyWithUrl = allCompany;
    for (let index = 0; index < allCompanyWithUrl?.length; index++) {
      const element = allCompanyWithUrl?.[index];

      const companyLogo = element?.company_logo;
      const companyLogoImage = `http://localhost:${process.env.PORT}/api/v1/image/${companyLogo?.filename}`;

      const cta = element?.company_cta;
      const ctaImage = `http://localhost:${process.env.PORT}/api/v1/image/${cta?.filename}`;

      allCompanyWithUrl[index].company_logo.imageurl = companyLogoImage;
      allCompanyWithUrl[index].company_cta.imageurl = ctaImage;
    }

    return res.status(200).json({ data: allCompanyWithUrl });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};
// Admin should be able to update user details name, profile photo, mobile, whatsapp number, email, country, state, city, role, subrole, gst_number and verification document(s), company name, company address

const updateCompany = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin' || isRole === 'company')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
    }
    const images = req?.files as Record<string, Express.Multer.File[]>;
    const logo = images?.logo?.[0];
    const cta = images?.cta?.[0];
    const {
      name,
      mobile,
      email,
      website,
      address,
      latitude,
      longitude,
      sponsored,
      verified,
      disabled,
      description,
    } = req.body;
    const updatedCompany = await AppDataSource.createQueryBuilder()
      .update(Company)
      .set({
        logo: logo,
        name: name,
        mobile: mobile,
        email: email,
        website: website,
        address: address,
        latitude: latitude,
        longitude: longitude,
        sponsored: sponsored,
        verified: verified,
        disabled: disabled,
        cta: cta,
        description: description,
      })
      .where({ id: user?.userId })
      .returning('*')
      .execute();
    return res
      .status(200)
      .json(messageFunction('Company Updated successfully'));
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const deleteCompany = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'company')) {
      return res.status(400).json(messageFunction('User is unauthorized'));
    }

    const deletedCompany = await companyRepository
      .createQueryBuilder('company')
      .delete()
      .from(Company)
      .where({ id: user.userId })
      .returning('*')
      .execute();

    return res
      .status(200)
      .json(messageFunction('Company deleted successfully'));
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

export {
  registerCompany,
  loginCompany,
  getAllCompany,
  updateCompany,
  deleteCompany,
};
