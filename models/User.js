import {Schema, model, models} from 'mongoose'

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        
    },
    profileImagePath: {
        type: String,
        required: [true, "Profile Image is required"],
    },
    wishList: {
        type: Array,
        default: []
    },
    cart: {
        type: Array,
        default: []
    },
    order: {
        type: Array,
        default: []
    },
    work: {
        type: Array,
        default: []
    }
})

const User = models.User || model('User', UserSchema)

export default User
