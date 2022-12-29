import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';
import { AppDataSource } from '../dataBaseConnection';
import { BookmarkedCatalogue } from '../entities/BookmarkedCatalogue.entity';
import { Catalogue } from '../entities/Catalogue.entity';
import { SubRole } from '../entities/SubRole.entity';
import { User } from '../entities/User.Entity';
const saltRounds = 12;

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
const returnFunction = (_message: string) => {
  const message = {
    message: _message,
  };
  return message;
};

const bookmarkCatalogueRepository =
  AppDataSource.getRepository(BookmarkedCatalogue);
const catalogueRepository = AppDataSource.getRepository(Catalogue);
const subRoleRepository = AppDataSource.getRepository(SubRole);
const userRepository = AppDataSource.getRepository(User);

const registerUser = async (req: Request, res: Response) => {
  try {
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

    if (!userExist) {
      const subRoleExist = await subRoleRepository
        .createQueryBuilder('subrole')
        .select()
        .where({ id: subrole })
        .getRawOne();

      if (!subRoleExist) {
        return res.status(400).json({ message: "Subrole doesn't Exist" });
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
        .json({ message: 'User SignUp successfully', token: token });
    }
    return res.status(400).json({ message: 'User Already Exist' });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userExist = await userRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .getOne();

    if (!userExist) {
      return res.status(400).json(returnFunction(" User doesn't exist"));
    }
    const hashPassword = userExist?.password;
    const correctPassword = await bcrypt.compare(password, hashPassword);
    if (!correctPassword) {
      return res.status(400).json(returnFunction('Enter the proper password'));
    }

    const token = jwt.sign(
      { userId: userExist?.id, role: 'user' },
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

// Admin should be able to update user details name, profile photo, mobile, whatsapp number, email, country, state, city, role, subrole, gst_number and verification document(s), company name, company address

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
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
      .where({ id: user?.userId })
      .returning('*')
      .execute();
    return res.status(200).json({ data: updatedUser?.raw?.[0] });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const deletedUser = await userRepository
      .createQueryBuilder('user')
      .softDelete()
      .from(User)
      .where({ id: user.userId })
      .returning('*')
      .execute();

    const task = cron.schedule(
      ' 10 * * * * * ',
      async () => {
        try {
          const deletedUserCron = await userRepository
            .createQueryBuilder('user')
            .delete()
            .from(User)
            .where('deletedAt is not null')
            .returning('*')
            .execute();
        } catch (error) {
          console.log('>>>>>>>>>>>>>>', error);
        }
      },
      { scheduled: false }
    );
    task.start();

    return res.status(201).json({ message: 'User is deleted' });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

//All the User in the database

const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }
    const AllUser = await userRepository
      .createQueryBuilder('company')
      .select()
      .getMany();

    // let allUserWithUrl = AllUser;
    // const urlSend = allUserWithUrl;
    // for (let index = 0; index < urlSend.length; index++) {
    //   const element = urlSend[index];
    //   const profilePhoto = element?.profilePhoto;
    //   const profilePhotoUrlImage = `http://localhost:2300/api/v1/image/${profilePhoto?.filename}`;
    //   const visitingCard = element?.visitingCard;
    //   const visitingCardUrlImage = `http://localhost:2300/api/v1/image/${visitingCard?.filename}`;
    //   const verificationDoc = element?.verificationDoc;
    //   console.log(typeof verificationDoc);
    //   // for (const key verificationDoc) {
    //   //   console.log('>>>',key);
    //   //   // if (Object.prototype.hasOwnProperty.call(object, key)) {
    //   //   //   const element = object[key];

    //   //   // }
    //   // }
    //   console.log(verificationDoc);
    //   console.log('>>>>>>>>>>', profilePhotoUrlImage);
    //   console.log('>>>>>>>>>>', visitingCardUrlImage);
    // }

    return res.status(200).json({ data: AllUser });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
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

const viewCatalog = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'admin' || isRole === 'user' || isRole === 'company')) {
      return res.json({ message: 'User is unauthorized' });
    }
    const { status } = req.body;
    const allCatalog = await catalogueRepository
      .createQueryBuilder('catalogue')
      .select()
      .where({ status: status })
      .getMany();

    if (!allCatalog) {
      return res.status(200).json({ message: 'No data available to show' });
    }
    return res.status(200).json({ data: allCatalog });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};
// Bookmark catalogue

const bookmarkCatalogue = async (req: Request, res: Response) => {
  try {
    const { catalogueId } = req.body;
    const user = req.app.get('user');
    const isRole = user?.role;

    if (!(isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }
    const bookmarkAlreadyExist = await bookmarkCatalogueRepository
      .createQueryBuilder()
      .select()
      .where({
        relCatalogue: catalogueId,
      })
      .andWhere({ relUser: user?.userId })
      .getOne();

    if (bookmarkAlreadyExist) {
      return res.json({ message: 'Bookmark already exist' });
    }
    const catalogueExist = await catalogueRepository
      .createQueryBuilder()
      .select()
      .where({ id: catalogueId })
      .getOne();
    if (!catalogueExist) {
      return res.json({ message: "Catalogue doesn't exist" });
    }
    const createdBookmark = await bookmarkCatalogueRepository
      .createQueryBuilder()
      .insert()
      .into(BookmarkedCatalogue)
      .values({
        relCatalogue: catalogueId,
        relUser: user?.userId,
      })
      .returning('*')
      .execute();
    if (!createdBookmark) {
      return res.json({ message: 'Enter proper Id of Catalog' });
    }

    return res.status(200).json({ data: createdBookmark?.raw?.[0] });
  } catch (error) {
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

export {
  registerUser,
  loginUser,
  getAllUser,
  updateUser,
  deleteUser,
  viewCatalog,
  bookmarkCatalogue,
};
