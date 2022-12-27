import { json, Request, Response } from 'express';
import { SubRole } from '../entities/SubRole.entity';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';
import { Company } from '../entities/Company.entity';
import { Catalogue } from '../entities/Catalogue.entity';
import authenticateToken from '../middleware/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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

const returnFunction = (_message: string) => {
  const message = {
    message: _message,
  };
  return message;
};

const adminRepository = AppDataSource.getRepository(Admin);
const subRoleRepository = AppDataSource.getRepository(SubRole);
const companyRepository = AppDataSource.getRepository(Company);
const catalogueRepository = AppDataSource.getRepository(Catalogue);

const registerCompany = async (req: Request, res: Response) => {
  try {
    // const { adminId, subRoleId } = req.query;

    const images = req?.files as Record<string, Express.Multer.File[]>;
    const logo = images?.logo?.[0];
    const cta = images?.cta?.[0];

    console.log(req.body);
    console.log(images);
    // console.log(logo);
    // console.log(cta);
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
      return res.status(400).json({ message: 'Company  Exist' });
    }
    const subRoleExist = await subRoleRepository
      .createQueryBuilder('subrole')
      .select()
      .where({ id: subrole })
      .getRawOne();

    if (!subRoleExist) {
      console.log(subRoleExist);
      return res.status(400).json({ message: "Subrole doesn't Exist" });
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
        // admin: adminExist.admin_id,
        subrole: subRoleExist?.subrole_id,
      })
      .returning('*')
      .execute();
    return res.status(200).json({ data: registeredCompany?.raw?.[0] });
  } catch (error) {
    console.log(error);
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const loginCompany = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const companyExist = await companyRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .getOne();

    // console.log(companyExist?.password);
    if (!companyExist) {
      return res.status(400).json(returnFunction("Company User doesn't exist"));
    }
    const hashPassword = companyExist?.password;
    const correctPassword = await bcrypt.compare(password, hashPassword);
    // console.log(correctPassword);
    if (!correctPassword) {
      return res.status(400).json(returnFunction('Enter the proper password'));
    }

    const token = jwt.sign(
      { userId: companyExist?.id, role: 'company' },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );
    // console.log(token);
    // console.log(process.env.TOKEN_KEY);
    return res
      .status(200)
      .json({ message: 'Company User login successfully', token: token });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const getAllCompany = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;
    // console.log(Boolean(isRole));

    if (!(isRole === 'admin' || isRole === 'company')) {
      return res.json({ message: 'User is unauthorized' });
    }
    const AllCompany = await companyRepository
      .createQueryBuilder('company')
      .select()
      .getMany();
    console.log(AllCompany);
    return res.status(200).json({ data: AllCompany });
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
    console.log(user.userId);

    if (!(isRole === 'admin' || isRole === 'company')) {
      return res.json({ message: 'User is unauthorized' });
    }
    console.log('>>>>>>>>>', 'hiiii');
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
    console.log(req.body);
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
    return res.status(200).json({ data: updatedCompany?.raw?.[0] });
  } catch (error) {
    // console.log(error);
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};
// const updateLastseen = await userRepository;
//         .createQueryBuilder('user')
//         .update(User)
//         .set({ lastSeen: new Date() })
//         .where({ id: id })
//         .returning('*')
//         .execute();

const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { adminId, companyId } = req.query;
    const adminExist = await adminRepository
      .createQueryBuilder('admin')
      .select()
      .where({ id: adminId })
      .getRawOne();
    if (adminExist) {
      const deletedCompany = await companyRepository
        .createQueryBuilder('company')
        .delete()
        .from(Company)
        .where({ id: companyId })
        .returning('*')
        .execute();

      res.status(201).json({ data: deletedCompany.raw[0] });
    } else {
      res.status(400).json({ message: 'User is Unauthorized' });
    }
  } catch (error) {
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

// //All the User in the database

// const getAllUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.query;

//     if (id?.length && id.length >= 1) {
//       const updateLastseen = await userRepository
//         .createQueryBuilder('user')
//         .update(User)
//         .set({ lastSeen: new Date() })
//         .where({ id: id })
//         .returning('*')
//         .execute();
//       const getUser = await userRepository
//         .createQueryBuilder('user')
//         .select()
//         .where({ id: id })
//         .getRawOne();
//       res.status(200).json({ data: getUser });
//     } else if (id === '') {
//       res.status(400).json({ message: 'Enter proper Id' });
//     } else {
//       const getUser = await userRepository
//         .createQueryBuilder('user')
//         .select()
//         .getRawMany();
//       res.status(200).json({ data: getUser });
//     }
//   } catch (error) {
//     const errors = errorFunction(error);
//     res.status(400).json({ errors });
//   }
// };

//
const companyCreateCatalogue = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.query;
    const files = req.files as Record<string, Express.Multer.File[]>;
    const pdf = files.pdf[0];
    const previewImage = files.previewImage[0];

    // console.log(req.body);
    // console.log(req.files);
    // console.log(pdf);
    // console.log(previewImage);

    const { name, description, isPrivate, status, editCount } = req.body;

    const companyExist = await companyRepository
      .createQueryBuilder('company')
      .select()
      .where({ id: companyId })
      .getRawOne();

    if (companyExist) {
      console.log(companyExist);
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
          companyOwner: companyExist.company_id,
          admin: companyExist.company_adminId,
        })
        .returning('*')
        .execute();
      res.status(200).json({ data: createdCatalogue.raw[0] });
    } else {
      res.status(400).json('User not Exist');
    }
  } catch (error) {
    console.log(error);
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

const companyUpdateCatalogue = async (req: Request, res: Response) => {
  try {
    const { companyId, catalogueId } = req.query;
    const files = req.files as Record<string, Express.Multer.File[]>;
    const pdf = files.pdf[0];
    const previewImage = files.previewImage[0];

    // console.log(req.body);
    // console.log(req.files);
    // console.log(pdf);
    // console.log(previewImage);

    const { name, description, isPrivate, status, editCount } = req.body;

    const companyExist = await companyRepository
      .createQueryBuilder('company')
      .select()
      .where({ id: companyId })
      .getRawOne();

    console.log(companyExist);
    if (companyExist) {
      const updatedCatalogue = await catalogueRepository
        .createQueryBuilder('catalogue')
        .update(Catalogue)
        .set({
          name: name,
          pdf: pdf,
          previewImage: previewImage,
          description: description,
          isPrivate: isPrivate,
          status: status,
          editCount: editCount,
        })
        .where({ id: catalogueId })
        .returning('*')
        .execute();
      res.status(200).json({ data: updatedCatalogue.raw[0] });
    } else {
      res.status(400).json('User not Exist');
    }
  } catch (error) {
    console.log(error);
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

const companyDeleteCatalogue = async (req: Request, res: Response) => {
  try {
    const { companyId, catalogueId } = req.query;
    const companyExist = await companyRepository
      .createQueryBuilder('company')
      .select()
      .where({ id: companyId })
      .getRawOne();
    // console.log(companyExist);

    if (companyExist) {
      console.log(companyExist.company_id);
      const deletedCatalogue = await catalogueRepository
        .createQueryBuilder('catalogue')
        .delete()
        .from(Catalogue)
        .where({ id: catalogueId })
        .andWhere({ companyOwner: companyExist.company_id })
        .returning('*')
        .execute();
      console.log(deletedCatalogue);

      res.status(201).json({ data: deletedCatalogue.raw[0] });
    } else {
      res.status(400).json({ message: 'User is Unauthorized' });
    }
  } catch (error) {
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

export {
  registerCompany,
  loginCompany,
  getAllCompany,
  updateCompany,
  deleteCompany,
  companyCreateCatalogue,
  companyUpdateCatalogue,
  companyDeleteCatalogue,
};
