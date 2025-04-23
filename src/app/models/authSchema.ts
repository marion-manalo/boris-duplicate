import mongoose, { Document, Schema, Model } from 'mongoose';

// interface to establish what a user is made up of
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

// establishes what the schema inside the mongoDB will look like
const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
},
    // very important: establishes which collection within the DB the user info will go
    { collection: 'loginInfo'}
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;