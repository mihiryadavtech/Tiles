import { json, Request, Response } from 'express';
import { SubRole } from '../entities/SubRole.entity';
import { User } from '../entities/User.Entity';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';
import { Catalogue } from '../entities/Catalogue.entity';

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
const catalogueRepository = AppDataSource.getRepository(Catalogue);
const subRoleRepository = AppDataSource.getRepository(SubRole);
const userRepository = AppDataSource.getRepository(User);

const createUser = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.query;
    const { subRoleId } = req.query;
    const images = req.files as Record<string, Express.Multer.File[]>;
    const profilePhoto = images.profilePhoto[0];
    const visitingCard = images.visitingCard[0];
    const verificationDoc = images.verificationDoc[0];

    const {
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

    const adminExist = await adminRepository
      .createQueryBuilder('admin')
      .select()
      .where({ id: adminId })
      .getRawOne();

    if (adminExist) {
      const subRoleExist = await subRoleRepository
        .createQueryBuilder('subrole')
        .select()
        .where({ id: subRoleId })
        .getRawOne();

      if (subRoleExist) {
        // parseInt(mobile);
        // parseInt(gstNumber);
        // parseInt(waMobile);
        // if (
        //   typeof name === 'string' &&
        //   typeof mobile === 'number' &&
        //   typeof waMobile === 'number' &&
        //   typeof email === 'string' &&
        //   typeof country === 'string' &&
        //   typeof state === 'string' &&
        //   typeof city === 'string' &&
        //   typeof gstNumber === 'number' &&
        //   typeof companyName === 'string' &&
        //   typeof companyAddress === 'string' &&
        //   typeof companyWebsite === 'string' &&
        //   typeof companyWebsite === 'string' &&
        //   typeof verified === 'boolean' &&
        //   typeof disabled === 'boolean'
        // ) {
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
            country: country,
            state: state,
            city: city,
            gstNumber: gstNumber,
            companyName: companyName,
            companyAddress: companyAddress,
            companyWebsite: companyWebsite,
            visitingCard: visitingCard,
            verificationDoc: verificationDoc,
            verified: verified,
            disabled: disabled,
            meta: meta,
            lastSeen: new Date(),
            subrole: subRoleExist.subrole_id,
          })
          .returning('*')
          .execute();
        res.status(200).json({ data: createdUser.raw[0] });
        // } else {
        //   res.status(400).json({ message: ' Enter proper type' });
        // }
      } else {
        res.status(400).json({ message: "Subrole doesn't Exist" });
      }
    } else {
      res.status(400).json({ message: 'User is Unauthorized' });
    }
  } catch (error) {
    console.log(error);
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

// Admin should be able to update user details name, profile photo, mobile, whatsapp number, email, country, state, city, role, subrole, gst_number and verification document(s), company name, company address

const updateUser = async (req: Request, res: Response) => {
  try {
    const { adminId, userId } = req.query;
    const images = req.files as Record<string, Express.Multer.File[]>;
    const profilePhoto = images.profilePhoto[0];
    const visitingCard = images.visitingCard[0];
    const verificationDoc = images.verificationDoc[0];
    const {
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
    const adminExist = await adminRepository
      .createQueryBuilder('admin')
      .select()
      .where({ id: adminId })
      .getRawOne();

    if (adminExist) {
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
          verificationDoc: verificationDoc,
          docType: docType,
          verified: verified,
          disabled: disabled,
          meta: meta,
        })
        .where({ id: userId })
        .returning('*')
        .execute();

      res.status(200).json({ data: updatedUser.raw[0] });
    } else {
      res.status(400).json({ message: 'User is Unauthorized' });
    }
  } catch (error) {
    // console.log(error);
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { adminId, userId } = req.query;
    const adminExist = await adminRepository
      .createQueryBuilder('admin')
      .select()
      .where({ id: adminId })
      .getRawOne();
    if (adminExist) {
      const deletedUser = await userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where({ id: userId })
        .returning('*')
        .execute();

      res.status(201).json({ data: deletedUser.raw[0] });
    } else {
      res.status(400).json({ message: 'User is Unauthorized' });
    }
  } catch (error) {
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};

//All the User in the database

const getAllUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (id?.length && id.length >= 1) {
      const updateLastseen = await userRepository
        .createQueryBuilder('user')
        .update(User)
        .set({ lastSeen: new Date() })
        .where({ id: id })
        .returning('*')
        .execute();
      const getUser = await userRepository
        .createQueryBuilder('user')
        .select()
        .where({ id: id })
        .getRawOne();
      res.status(200).json({ data: getUser });
    } else if (id === '') {
      res.status(400).json({ message: 'Enter proper Id' });
    } else {
      const getUser = await userRepository
        .createQueryBuilder('user')
        .select()
        .getRawMany();
      res.status(200).json({ data: getUser });
    }
  } catch (error) {
    const errors = errorFunction(error);
    res.status(400).json({ errors });
  }
};
//
//
//
//
//
//
//
//
const userCreateCatalogue = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const files = req.files as Record<string, Express.Multer.File[]>;
    const pdf = files.pdf[0];
    const previewImage = files.previewImage[0];

    // console.log(req.body);
    // console.log(req.files);
    // console.log(pdf);
    // console.log(previewImage);

    const { name, description, isPrivate, status, editCount } = req.body;

    const userExist = await userRepository
      .createQueryBuilder('user')
      .select()
      .where({ id: userId })
      .getRawOne();

    if (userExist) {
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
          userOwner: userExist.user_id,
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

const userUpdateCatalogue = async (req: Request, res: Response) => {
  try {
    const { userId, catalogueId } = req.query;
    const files = req.files as Record<string, Express.Multer.File[]>;
    const pdf = files.pdf[0];
    const previewImage = files.previewImage[0];

    // console.log(req.body);
    // console.log(req.files);
    // console.log(pdf);
    // console.log(previewImage);

    const { name, description, isPrivate, status, editCount } = req.body;

    const userExist = await userRepository
      .createQueryBuilder('user')
      .select()
      .where({ id: userId })
      .getRawOne();

    console.log(userExist);
    if (userExist) {
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

const userDeleteCatalogue = async (req: Request, res: Response) => {
  try {
    const { userId, catalogueId } = req.query;
    const userExist = await userRepository
      .createQueryBuilder('user')
      .select()
      .where({ id: userId })
      .getRawOne();
    console.log(userExist);
    if (userExist) {
      const deletedCatalogue = await catalogueRepository
        .createQueryBuilder('catalogue')
        .delete()
        .from(Catalogue)
        .where({ id: catalogueId })
        .andWhere({ userOwner: userExist.user_id })

        .returning('*')
        .execute();

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
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
  userCreateCatalogue,
  userUpdateCatalogue,
  userDeleteCatalogue,
};
