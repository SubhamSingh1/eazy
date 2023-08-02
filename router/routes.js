"use strict";

const express = require("express");
const router = express.Router();
const userManagementController = require("../controllers/userManagement");
const jwt_authentication = require("../apps/jwt_auth");

// User Auth APIs
router.post("/login", userManagementController.login); // Login Api
router.post("/logout", jwt_authentication, userManagementController.logout); // Logout Api

// USERS CRUD APIs
router.get("/users", jwt_authentication, userManagementController.getUsers); //User list
router.put("/users", jwt_authentication, userManagementController.editUser); // Edit user
router.post("/users", userManagementController.registerUser); // Add or register user
router.delete(
  "/users",
  jwt_authentication,
  userManagementController.deleteUser // Delete user
);

module.exports = router;
