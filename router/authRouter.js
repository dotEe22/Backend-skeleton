const express = require('express');
const { signup, login } = require('../controller/authController.js');

const authRouter = express.Router();

authRouter
    // .get(getAllStudents)
    .post("/signup", signup)
    .post("/login", login)
    
// .put(updateManyStudents)

// studentRouter.route("/:id")
//     .get(getSingleStudent)
//     .patch(editStudentInfo)
//     .delete(deleteStudent)

module.exports = authRouter;