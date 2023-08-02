"use strict";

const Users = require("../models/index").Users;
const sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const {
  getUserByEmail,
  parseData,
  getUserById,
} = require("../utils/userDetails");
const Op = sequelize.Op;

class Userservice {
  static async getUserList() {
    try {
      const userList = await Users.findAll({});

      const parsed_list = await parseData(userList);

      if (userList.length) {
        return parsed_list;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async registerUser(name, email, password, conf_password) {
    try {
      const isUserFound = await getUserByEmail(email);
      if (isUserFound === null) {
        if (password === conf_password) {
          let userObj = new Users({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 12),
          });

          await userObj.save();

          return true;
        } else {
          return "password";
        }
      } else {
        return "email";
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async editUser(user_id, name, email) {
    try {
      const userData = await getUserById(user_id);

      if (userData) {
        await userData.update({
          name,
          email,
        });

        return "success";
      } else {
        return "not-found";
      }
    } catch (e) {
      console.log(e);
    }
  }

  static async deleteUser(user_id) {
    try {
      const userData = await getUserById(user_id);
      if (userData) {
        await userData.destroy();
        return "success";
      }
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}

module.exports = Userservice;
