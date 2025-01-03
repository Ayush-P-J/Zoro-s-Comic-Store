const { type } = require("express/lib/response");
const mongoose = require("mongoose");

async function connection() {
    return mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => console.log("Connected to MongoDB"))
      .catch(err => console.error("Connection error:", err));
    
}

// schema of details
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: false,


    },
    userName: {
        type: String,
        required: false,

    },
    phone: {
        type: Number,
        required: false,
        sparse: true,
        default: null

    },
    googleId: {
        type: String,
        unique: true,
        sparse: true

    },
    email: {
        type: String,
        required: true,
        unique: true,


    },
    addresses: [{
        recipientName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        addressLine: {
            type: String,
            required: true
        },
        landmark: {
            type: String // Optional second line for apartment or suite number
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pinCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            default: "India"
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    appliedCoupons: [{
        couponId: {
            type: String,
            required: true
        },
        
    }],
    password: {
        required: false,
        type: String,
        default: null
    },
    isBlocked: {
        default: false,
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });


//schema of otp
// const userOTPSchema = new mongoose.Schema({
//     userId:{
//         type:String
//     },
//     otp:{
//         type:String
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
//     },

// });



// const OTP = mongoose.model('userOTP',userOTPSchema);
const User = mongoose.model('user', userSchema);




module.exports = {
    User,
    connection,

}