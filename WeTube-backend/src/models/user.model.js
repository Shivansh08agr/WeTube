import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        default: "https://res.cloudinary.com/dnfmwwo76/image/upload/fl_preserve_transparency/v1739292614/nlda2l8kzbuotk0cnmna.jpg?_s=public-apps"
    },
    coverImage: {
        type: String, //cloudinary image
        default: "https://res.cloudinary.com/dnfmwwo76/image/upload/fl_preserve_transparency/v1739468141/coverImage_l8tw1d.jpg?_s=public-apps"
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }
},
    {
        timestamps: true
    });

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) { //using isModified we can check if whatever's inside
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = model('User', userSchema);