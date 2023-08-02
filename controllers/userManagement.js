const UserService = require("../services/userService");
const Users = require("../models/index").Users;
const { Jwt } = require("../apps/jwt");
const {
  unauthorizedResponse,
  badRequestResponse,
  okResponse,
} = require("../helpers/customMessage.js");
const joiSchema = require("../validator/schema");
const { getUserByEmail } = require("../utils/userDetails");
const bcrypt = require("bcrypt");
const joiOptions = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

class userManagementController extends UserService {
  constructor() {
    super();
  }

  static async registerUser(req, res) {
    try {
      const { email, name, password, conf_password } = req.body;

      const result = await super.registerUser(
        name,
        email,
        password,
        conf_password
      );

      const { error } = await joiSchema.userAddSchema.validate(
        req.body,
        joiOptions
      );

      if (error) return badRequestResponse(req, res, error.message);

      switch (result) {
        case true:
          return okResponse(req, res, `Succesfully created user`);
        case "password":
          return badRequestResponse(req, res, `passwords donot match`);
        case "email":
          return badRequestResponse(
            req,
            res,
            `This Email  has already been added.`
          );
      }
    } catch (e) {
      console.log(e);
      return badRequestResponse(req, res, e);
    }
  }

  static async editUser(req, res) {
    try {
      const { name, email } = req.body;
      const { user_id } = req.user;

      if (Object.keys(req.body).length == 0)
        return badRequestResponse(req, res, `Body empty`);

      const { error } = await joiSchema.userEditSchema.validate(
        req.body,
        joiOptions
      );
      if (error) return badRequestResponse(req, res, error.message);

      const result = await super.editUser(user_id, name, email);

      switch (result) {
        case "success":
          return okResponse(req, res, `Successfully edited user details`);

        case "not-found":
          return badRequestResponse(req, res, `User data not found`);

        default:
          return badRequestResponse(req, res, `Something went wrong`);
      }
    } catch (e) {
      console.log(e);
      return badRequestResponse(req, res, e);
    }
  }

  static async getUsers(req, res) {
    try {
      const getUserList = await super.getUserList();

      if (getUserList == null) {
        return badRequestResponse(req, res, "No users found");
      } else {
        return okResponse(req, res, getUserList);
      }
    } catch (e) {
      console.log(e);
      return badRequestResponse(req, res, e);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { user_id } = req.user;

      const result = await UserService.deleteUser(user_id);

      if (result == null || result == undefined) {
        return badRequestResponse(req, res, "No user found");
      } else {
        return okResponse(req, res, "Successfully deleted user");
      }
    } catch (e) {
      console.log(e);
      return badRequestResponse(req, res, e);
    }
  }

  static async login(req, res) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error("You are not authorized.");
      return unauthorizedResponse(req, res, err.message);
    }

    let auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    let email = auth[0];
    let password = auth[1];

    const { error } = joiSchema.validateLoginParams.validate(
      { email, password },
      joiOptions
    );

    if (error) {
      return badRequestResponse(req, res, error.details[0].message);
    }

    const user = await getUserByEmail(email.toLowerCase());

    console.log(user);

    if (!user) {
      const err = new Error("No user with that email found.");
      return unauthorizedResponse(req, res, err.message);
    } else {
      bcrypt.compare(password, user.password, async (error, isMatch) => {
        if (error) {
          const err = new Error("passwords do not match.");
          return unauthorizedResponse(req, res, err.message);
        } else if (isMatch) {
          const loginToken = new Jwt().createToken(
            { email: user.email, user_id: user.user_id },
            { expiresIn: "1h" }
          );

          await user.update({ login_token: loginToken });

          const message = {
            email: user.email,
            login_token: loginToken,
            user_id: user.user_id,
            user_name: user.name,
          };

          return okResponse(req, res, message);
        } else {
          const err = new Error(
            "your password do not matches with our records."
          );
          return unauthorizedResponse(req, res, err.message);
        }
      });
    }
  }

  static async logout(req, res) {
    try {
      const { email } = req.body;
      if (!email)
        return badRequestResponse(req, res, `Please provide a valid email`);
      const user = await getUserByEmail(email);

      switch (user) {
        case null:
          return badRequestResponse(
            req,
            res,
            `No user exists with this email ${email}`
          );
        default:
          await user.update({ login_token: null });
          return okResponse(
            req,
            res,
            `User with email: ${email} has been logged out successfully.`
          );
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = userManagementController;
