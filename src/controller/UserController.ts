import {AppDataSource} from "../data-source";
import {NextFunction, Request, Response} from "express";
import {User, UserStatus} from "../entity/User";
import {hashPassword} from "../../utils/hashPassword";
import {comparePassword} from "../../utils/validatePassword";
import {sendOTP} from "../../utils/sendOTP";
import {createToken} from "../../utils/jwt";
import {sendOTPEmail} from "../../utils/sendEmail";
import {saveImage} from "../../utils/saveImage";
import {getOtp, setOtp} from "../../utils/redis/set_get_otp";
import {createUserSchema} from "../../schema/createUserSchema";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return { message: await this.userRepository.find(), status: 200 };
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    // validate schema
    const validatedData = await createUserSchema.validateAsync(request.body);

    validatedData.password = await hashPassword(validatedData.password);

    // check if email or phone already exist
    const userExist = await this.userRepository.findOne({
      where: [{ email: validatedData.email }, { phone: validatedData.phone }],
    });
    if (userExist) {
      if (userExist.email === validatedData.email) {
        return { message: "email already exist", status: 409 };
      } else if (userExist.phone === validatedData.phone) {
        return { message: "phone already exist", status: 409 };
      }
    }

    // store user profile picture
    if (validatedData.userImage) {
      // save image to file system and get path
      // insert image path into vehicle object
      validatedData.userImage = await saveImage(validatedData.userImage);
    }

    const dbUser = await this.userRepository.save(validatedData);

    // check if dbUser is not null, then return dbUser and status as 200
    if (!dbUser) {
      return { message: "user not created", status: 400 };
    }

    // return everything except password and role from dbUser
    const { password, role, userImage, createdAt, updatedAt, ...rest } = dbUser;
    return { message: rest, status: 200 };
  }

  async softDelete(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    let userToRemove = await this.userRepository.findOneBy({ id });

    if (!userToRemove) {
      return { message: "unregistered user", status: 404 };
    }

    // Set the status to DELETED
    userToRemove.status = UserStatus.DELETED;

    // Save the updated user entity
    await this.userRepository.save(userToRemove);

    return { message: "user soft deleted", status: 200 };
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return { message: "unregistered user", status: 404 };
    }
    // if comparePassword return false, then return "wrong password" and send status as 400
    if (!(await comparePassword(password, user.password))) {
      return { message: "wrong password", status: 401 };
    }

    const accessToken = createToken({ id: user.id });
    return { message: accessToken, status: 200 };
  }

  async phoneLogin(request: Request, response: Response, next: NextFunction) {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();

    let expiry = new Date();
    let status = 200;
    expiry.setMinutes(expiry.getMinutes() + 5);

    let { countryCode, phone } = request.body;
    let key: string;
    const user = await this.userRepository.findOne({
      where: { phone, countryCd: countryCode },
    });

    if (user) {
      key = user.id.toString();
    } else {
      status = 404;
      key = `${countryCode}${phone}`;
    }

    try {
      // send otp to phone
      const otpSent = await sendOTP(countryCode + phone, otpValue);
      // store otp in redis
      const storedOTP = await setOtp(key, otpValue);
    } catch (error) {
      return { message: "error storing otp", status: 500 };
    }

    return { message: "OTP sent", status: status };
  }

  async otpVerify(request: Request, response: Response, next: NextFunction) {
    const { otp, phone, countryCode, userId } = request.body;
    let key: string;
    // if existing user, then use userId to get otp from redis
    if (userId) {
      key = userId;
    } // if new user, then use phone and countryCode to get otp from redis
    else {
      key = `${countryCode}${phone}`;
    }
    const otpDB = await getOtp(key);
    if (!otpDB) {
      return { message: "OTP expired", status: 401 };
    }
    // compare otp from redis with otp from request body
    if (otpDB !== otp) {
      return { message: "wrong OTP", status: 401 };
    }
    // if existing user, then return accessToken and send status as 200
    if (userId) {
      const accessToken = createToken({ id: userId });
      return { message: accessToken, status: 200 };
    }

    return { message: "OTP verified", status: 200 };
  }

  async forgotPassword(
      request: Request,
      response: Response,
      next: NextFunction
  ) {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    const { email } = request.body;
    let expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);

    // check if email or phone already exist
    const userExist = await this.userRepository.findOne({
      where: { email },
    });

    if (!userExist) {
      return { message: "unregistered email", status: 404 };
    }
    // if email exist, then send otp to email
    const emailSent = sendOTPEmail(email, otpValue);
    // if otp sent successfully, then store otp in db
    console.log(userExist);

    if (!emailSent) {
      return { message: "email not sent", status: 400 };
    } else {
      // store otp in redis
      const storedOTP = await setOtp(userExist.id.toString(), otpValue);
    }
    // if otp stored successfully, then return "otp sent" and send status as 200
    return { message: "otp sent", status: 200 };
  }
}
