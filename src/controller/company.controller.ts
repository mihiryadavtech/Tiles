import { json, Request, Response } from 'express';
import { SubRole } from '../entities/SubRole.entity';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';
import { Company } from '../entities/Company.entity';
import { Catalogue } from '../entities/Catalogue.entity';

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
const companyRepository = AppDataSource.getRepository(Company);
const catalogueRepository = AppDataSource.getRepository(Catalogue);

const registerCompany = async (req: Request, res: Response) => {
  try {
    const { adminId, subRoleId } = req.query;
    const images = req?.files as Record<string, Express.Multer.File[]>;
    const logo = images?.logo?.[0];
    const cta = images?.cta?.[0];

    // console.log(req.body);
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
      sponsered,
      verified,
      disabled,
      description,
      subrole,
      admin,
    } = req.body;

    const subRoleExist = await subRoleRepository
      .createQueryBuilder('subrole')
      .select()
      .where({ id: subRoleId })
      .getRawOne();

    if (!subRoleExist) {
      return res.status(400).json({ message: "Subrole doesn't Exist" });
    }
    const registeredCompany = await companyRepository
      .createQueryBuilder()
      .insert()
      .into(Company)
      .values({
        logo: logo,
        name: name,
        mobile: mobile,
        email: email,
        password: password,
        website: website,
        address: address,
        latitude: latitude,
        longitude: longitude,
        sponsered: sponsered,
        verified: verified,
        disabled: disabled,
        cta: cta,
        description: description,
        // admin: adminExist.admin_id,
        // subrole: subRoleExist.subrole_id,
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

// Admin should be able to update user details name, profile photo, mobile, whatsapp number, email, country, state, city, role, subrole, gst_number and verification document(s), company name, company address

// const updateUser = async (req: Request, res: Response) => {
//   try {
//     const { adminId, userId } = req.query;
//     const images = req.files as Record<string, Express.Multer.File[]>;
//     const profilePhoto = images.profilePhoto[0];
//     const visitingCard = images.visitingCard[0];
//     const verificationDoc = images.verificationDoc[0];
//     const {
//       name,
//       mobile,
//       waMobile,
//       email,
//       country,
//       state,
//       city,
//       role,
//       gstNumber,
//       companyName,
//       companyAddress,
//       companyWebsite,
//       docType,
//       verified,
//       disabled,
//       meta,
//     } = req.body;
//     const adminExist = await adminRepository
//       .createQueryBuilder('admin')
//       .select()
//       .where({ id: adminId })
//       .getRawOne();

//     if (adminExist) {
//       const updatedUser = await AppDataSource.createQueryBuilder()
//         .update(User)
//         .set({
//           name: name,
//           profilePhoto: profilePhoto,
//           mobile: mobile,
//           waMobile: waMobile,
//           email: email,
//           country: country,
//           state: state,
//           city: city,
//           role: role,
//           gstNumber: gstNumber,
//           companyName: companyName,
//           companyAddress: companyAddress,
//           companyWebsite: companyWebsite,
//           visitingCard: visitingCard,
//           verificationDoc: verificationDoc,
//           docType: docType,
//           verified: verified,
//           disabled: disabled,
//           meta: meta,
//         })
//         .where({ id: userId })
//         .returning('*')
//         .execute();

//       res.status(200).json({ data: updatedUser.raw[0] });
//     } else {
//       res.status(400).json({ message: 'User is Unauthorized' });
//     }
//   } catch (error) {
//     // console.log(error);
//     const errors = errorFunction(error);
//     res.status(400).json({ errors });
//   }
// };

const deletecompany = async (req: Request, res: Response) => {
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
  deletecompany,
  companyCreateCatalogue,
  companyUpdateCatalogue,
  companyDeleteCatalogue,
};
