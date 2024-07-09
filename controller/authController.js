// const userModel = require("../Model/userModel");
// const jwt = require("jsonwebtoken");
// const AppError = require("../Utils/appError");
// const catchAsync = require('../Utils/catchAsync');
// const { promisify } = require("util");


// const signedToken = id => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
// }

// const signup = async (req, res) => {

//     // WRONG PRACTISE - gets all , accepts all

//     // const newUser = await userModel.create(req.body);
//     // res.status(201).json({
//     //     status: "success",
//     //     data: {
//     //         user: newUser
//     //     }
//     // });

//     const newUser = await userModel.create({
//         name: req.body.name,
//         email: req.body.email,
//         phoneNumber: req.body.phoneNumber,
//         password: req.body.password,
//         confirmPassword: req.body.confirmPassword,
//         role: req.body.role,
//         passwordChangedAt: req.body.passwordChangedAt
//     })

//     const token = signedToken(newUser._id)
//     res.status(201).json({
//         status: "success",
//         token,
//         data: {
//             user: newUser,

//         }

//     })





//     // try {
//     //     const newUser = await userModel.create(req.body);
//     //     res.status(201).json({
//     //         status: "success",
//     //         data: {
//     //             user: newUser
//     //         }
//     //     });
//     // } catch (error) {
//     //     res.status(500).json({
//     //         status: "error",
//     //         message: "Failed to create user",
//     //         error: error.message
//     //     });
//     // }
// };

// const login = catchAsync(async (req, res, next) => {
//     const { email, password } = req.body;

//     //check if email and password are provided
//     if (!email || !password) {
//         return next(console.log('please provide email and password'))
//     }
//     // check if user exist and password is correct
//     const user = await userModel.findOne({ email }).select('+ password');


//     // const correct 

//     // if everything is ok send token to clients
//     if (!user || !(await user.correctPassword(password, user.password))) {
//         return next(new AppError("incorrect email or password", 401))
//     };

//     const token = signedToken(user._id);
//     res.status(200).json({
//         status: "success",
//         token
//     });
// })

// const protect = catchAsync(async (req, res, next) => {
//     //check if there is token
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         token = req.headers.authorization.split(" ")[1]
//     };

//     console.log(token);

//     if (!token) {
//         return next(new AppError("you are not logged in, kindly login to access this route",401))
//     };
//     // verify the token
//     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
//     console.log(decoded)
//     // verify the token still exists 
//     const currentUser = await user.findByid(decoded.id)
//     if (!currentUser) {
//         return next(new AppError("Token exists, User dosen't exist"))
//     }


//     //check if user changed password after token was issued

//     if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next(new AppError("user recently changed password, please login again", 401))
//     }

//     //grant access
//     req.user = currentUser;
//     next();
// })


// module.exports = { signup, login, protect };

const userModel = require("../Model/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../Utils/appError");
const catchAsync = require('../Utils/catchAsync');
const { promisify } = require("util");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const signup = catchAsync(async (req, res, next) => {
    const newUser = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
        passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id);
    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // Check if user exists and password is correct
    const user = await userModel.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token
    });
});

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in, kindly login to access this route', 401));
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password, please login again', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
});

module.exports = { signup, login, protect };
