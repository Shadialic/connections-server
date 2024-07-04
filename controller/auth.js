import UserDb from "../model/userModel.js";
import OTP from "../model/otpModel.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../utils/Jwt/secretoken..js";
import { Sequelize } from "sequelize";
import otpGenerator from "otp-generator";
import { uploadToCloudinary } from "../utils/Cloudnery/cloudnery.js";

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserDb.findAll();
    res.json(allUsers);
  } catch (err) {
    console.log(err);
  }
};

const postUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    const exist = await UserDb.findOne({
      where: { email: email },
    });
    if (exist) {
      return res.json({ message: "Email already exists" });
    }
    await sendOTP(email);
    return res.status(200).json({
      message: "OTP sent successfully",
      userData: {
        userName,
        email,
        password,
        image: req.file ? req.file.path : null,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

const googleRegistration = async (req, res) => {
  try {
    const { id, name, email, picture } = req.body;
    const data = await UserDb.findOne({
      where: { email: email },
    });
    if (!data) {
      const hashedPassword = await bcrypt.hash(id, 10);
      const googleUser = await UserDb.create({
        userName: name,
        email,
        password: hashedPassword,
        picture: picture,
        is_google: true,
        is_Active: true,
      });
      if (googleUser) {
        const token = createSecretToken(
          exist.id,
          exist.userName,
          exist.email,
          exist.picture
        );
        res.status(200).json({
          userData: exist,
          status: true,
          err: null,
          token,
        });
      }
      if (token) {
        return res.status(200).json({
          created: true,
          message: "Google registration successful",
          token,
          userData,
        });
      }
    } else {
      const token = createSecretToken(
        data.id,
        data.userName,
        data.email,
        data.picture
      );
      if (token) {
        return res.status(200).json({
          created: true,
          message: "Google registration successful",
          token,
          data,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const sendOTP = async (email) => {
  try {
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ where: { otp: otp } });
    while (result) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false });
      result = await OTP.findOne({ where: { otp: otp } });
    }

    const otpPayload = { email, otp };
    await OTP.create(otpPayload);
    console.log({ success: true, alert: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    throw new Error("Error in sending OTP");
  }
};

const otpVerification = async (req, res) => {
  try {
    const { finalValue } = req.body;
    const { userName, email, password, image } = req.body.userData;
    const otp = finalValue;
    if (!otp) {
      return res.json({ status: false, message: "OTP is required" });
    }
    const checkUserPresent = await OTP.findOne({ where: { otp: otp } });
    if (checkUserPresent) {
      const currentTime = new Date();
      const otpCreationTime = new Date(checkUserPresent.createdAt);
      const timeDifference = (currentTime - otpCreationTime) / 1000;
      if (timeDifference > 90) {
        return res.json({ status: false, message: "OTP has expired" });
      }
      const user = await UserDb.findOne({
        where: { email: checkUserPresent.email },
      });
      const imgUrl = await uploadToCloudinary(image, "profile");
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserDb.create({
          userName: userName,
          email: email,
          password: hashedPassword,
          picture: imgUrl.url || undefined,
        });
        return res.status(200).json({
          success: true,
          alert: "User Activated successfully",
          user: newUser,
          status: true,
        });
      } else {
        return res.json({ status: false, message: "User already exists" });
      }
    } else {
      return res.json({ status: false, message: "Wrong OTP" });
    }
  } catch (error) {
    console.error("Error while checking for user:", error);
    return res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

const LoadUser = async (req, res) => {
  try {
    console.log(req.body);
    const k = await UserDb.findAll();
    const { email, password } = req.body.formData;
    const exist = await UserDb.findOne({
      where: { email },
    });
    if (exist) {
      if (password && exist.password) {
        const compared = await bcrypt.compare(password, exist.password);
        if (compared) {
          const token = createSecretToken(
            exist.id,
            exist.userName,
            exist.email,
            exist.picture
          );
          res.status(200).json({
            userData: exist,
            status: true,
            err: null,
            token,
          });
        } else {
          res.json({ alert: "Incorrect password!" });
        }
      } else {
        res.json({ alert: "Password is missing!" });
      }
    } else {
      res.json({ alert: "Email not found!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ alert: "Server error!" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const whereClause = searchQuery
      ? {
          [Sequelize.Op.or]: [
            { userName: { [Sequelize.Op.iLike]: `%${searchQuery}%` } },
            { email: { [Sequelize.Op.iLike]: `%${searchQuery}%` } },
          ],
          id: { [Sequelize.Op.ne]: req.userId },
        }
      : {
          id: { [Sequelize.Op.ne]: req.userId },
        };
    const users = await UserDb.findAll({
      where: whereClause,
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export {
  postUser,
  LoadUser,
  googleRegistration,
  getAllUsers,
  otpVerification,
  searchUsers,
};
