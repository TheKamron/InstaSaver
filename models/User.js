import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    ID: {type: Number, required: true, unique: true},
    isBot: {type: String, required: true},
    firstName: {type: String, required: true},
    userName: {type: String, required: true},
    status: {type: String},
    admin: {type: String, default: false}
})

const User = model('User', UserSchema)

export default User;