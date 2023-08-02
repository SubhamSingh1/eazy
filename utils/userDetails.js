const userModel = require("../models/index").Users;

class UserDetails {
  static async getUserByEmail(email) {
    try {
      const user = await userModel.findOne({
        where: { email: email },
      });
      return user;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  static async getUserById(user_id) {
    try {
      const user = await userModel.findOne({
        where: { user_id },
      });
      return user;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  static async parseData(data) {
    try {
      const parsed_data = JSON.parse(JSON.stringify(data));
      return parsed_data;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
}

module.exports = UserDetails;
