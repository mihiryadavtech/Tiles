import { json, Request, Response } from 'express';
import { SubRole } from '../entities/SubRole.entity';
import { User } from '../entities/User.Entity';
import { AppDataSource } from '../dataBaseConnection';
import { Admin } from '../entities/Admin.entity';
import { Catalogue } from '../entities/Catalogue.entity';
import { subroleRouter } from 'src/routes/subrole.routes';
import cron, { schedule } from 'node-cron';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 12;

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

const adminRepository = AppDataSource.getRepository(Admin);
const catalogueRepository = AppDataSource.getRepository(Catalogue);
const subRoleRepository = AppDataSource.getRepository(SubRole);
const userRepository = AppDataSource.getRepository(User);

const registerUser = async (req: Request, res: Response) => {
  try {
    const images = req?.files as Record<string, Express.Multer.File[]>;
    const profilePhoto = images?.profilePhoto?.[0];
    const visitingCard = images?.visitingCard?.[0];
    const verificationDoc = images?.verificationDoc;
    console.log('[[[[[[[[[[[[', images);
    // console.log(req.files);
    console.log('/////////////////', verificationDoc);
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
    console.log('++++++++++++++', req.body);
    console.log(typeof email);
    const userExist = await userRepository
      .createQueryBuilder()
      .select()
      .where({
        email: email,
      })
      .getOne();
    console.log('userExist>>>>>>>>', userExist);
    if (!userExist) {
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
      return res.status(200).json({ data: createdUser?.raw?.[0] });
    }
    return res.status(400).json({ message: 'User Already Exist' });
  } catch (error) {
    console.log(error);
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

    // console.log(userExist?.password);
    if (!userExist) {
      return res.status(400).json(returnFunction(" User doesn't exist"));
    }
    const hashPassword = userExist?.password;
    const correctPassword = await bcrypt.compare(password, hashPassword);
    // console.log(correctPassword);
    if (!correctPassword) {
      return res.status(400).json(returnFunction('Enter the proper password'));
    }

    const token = jwt.sign(
      { userId: userExist?.id, role: 'user' },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );
    console.log(token);
    // console.log(process.env.TOKEN_KEY);
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
    console.log(user);

    if (!(isRole === 'admin' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }

    const images = req?.files as Record<string, Express.Multer.File[]>;
    const profilePhoto = images?.profilePhoto?.[0];
    const visitingCard = images?.visitingCard?.[0];
    const verificationDoc = images?.verificationDoc;
    console.log('[[[[[[[[[[[[', images);
    // console.log(req.files);
    console.log('/////////////////', verificationDoc);
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
      subrole,
    } = req.body;
    console.log('++++++++++++++', req.body);
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

    res.status(400).json({ message: 'User is Unauthorized' });
  } catch (error) {
    // console.log(error);
    const errors = errorFunction(error);
    return res.status(400).json({ errors });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.app.get('user');
    const isRole = user?.role;
    // console.log(Boolean(isRole));

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
    console.log(deletedUser);

    const task = cron.schedule(
      '*/30 * * * * * ',
      async () => {
        try {
          console.log('Running Before Now');
          const deletedUserCron = await userRepository
            .createQueryBuilder('user')
            .delete()
            .from(User)
            .where('deletedAt is not null')
            .returning('*')
            .execute();
          console.log(deletedUserCron);
          console.log('Running After Now');
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
    // console.log(Boolean(isRole));

    if (!(isRole === 'admin' || isRole === 'user')) {
      return res.json({ message: 'User is unauthorized' });
    }
    const AllUser = await userRepository
      .createQueryBuilder('company')
      .select()
      .getMany();
    console.log(AllUser);

    let allUserWithUrl = AllUser;
    const urlSend = allUserWithUrl;
    for (let index = 0; index < urlSend.length; index++) {
      const element = urlSend[index];
      const profilePhoto = element?.profilePhoto;
      const profilePhotoUrlImage = `http://localhost:8000/api/v1/image/${profilePhoto?.filename}`;
      const visitingCard = element?.visitingCard;
      const visitingCardUrlImage = `http://localhost:8000/api/v1/image/${visitingCard?.filename}`;
      const verificationDoc = element?.verificationDoc;
      // for (let index = 0; index < verificationDoc; index++) {

      // }
      console.log(verificationDoc);
      console.log('>>>>>>>>>>', profilePhotoUrlImage);
      console.log('>>>>>>>>>>', visitingCardUrlImage);
    }

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
export { registerUser, loginUser, getAllUser, updateUser, deleteUser };
