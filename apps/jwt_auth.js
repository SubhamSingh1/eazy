"use strict";
const Users = require("../models/index").Users;
const { Jwt } = require("./jwt");

const { unauthorizedResponse } = require("../helpers/customMessage.js");

class Token {
  async authenticate(req, res, next) {
    const bearerHearder = req.headers["authorization"];

    if (typeof bearerHearder != "undefined") {
      try {
        const bearer = bearerHearder.split(" ");
        const bearerToken = bearer[1];
        const decode = await new Jwt().verifyToken(bearerToken);

        const users = await Users.findOne({
          where: { user_id: decode.user_id },
        });

        req.user = decode;

        if (users.login_token === null) {
          return unauthorizedResponse(req, res, `User is unauthorised.`);
        } else if (users.login_token == bearerToken) {
          next();
        } else {
          return unauthorizedResponse(req, res, `you have been logged out`);
        }
      } catch (e) {
        console.log(e);
        return unauthorizedResponse(req, res, `Your token is expired.`);
      }
    } else {
      return unauthorizedResponse(
        req,
        res,
        `A token is required for authentication.`
      );
    }
  }
}

module.exports = new Token().authenticate;
