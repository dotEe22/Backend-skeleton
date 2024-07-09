const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "please enter your name"]
    },

    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        trim: true,
        validate: [
            validator.isEmail, "please enter a valid email"
        ]

    },

    phoneNumber: {
        type: String,
        required: [true, "please enter your phone number"],
        unique: true


    },

    password: {

        type: String,
        required: [true, "please provide your password "],
        minlength: 8,
        select: false
    },

    confirmPassword: {
        type: String,
        required: [true, "please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password
            },

            message: "passwords don't match"
        }





    },

    // passwordChangedAt:Date
   
 




});
// code to run before saving your password"pre-save"
userSchema.pre("save", async function (next) {
    // only run this if password is being changed
    if (!this.isModified("password"))
        next();
    // hash your password with 12
    this.password = await bcrypt.hash(this.password, 12)

    // delete confirmed password from database
    this.confirmPassword = undefined
    next()

})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword ){
    return await bcrypt.compare(candidatePassword, userPassword)
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);



        return JWTTimestamp < changedTimestamp;

    };

    return false;
};



const User = mongoose.model('User', userSchema);

module.exports = User;