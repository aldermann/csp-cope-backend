import bcrypt from "bcrypt";
import mongoose from "mongoose";

export type UserType = mongoose.Document & {
    username: string;
    verified: boolean;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    privilege: string;
    profile: {
        email: string;
        name: string;
        gender: string;
        avatar: string;
    };
    comparePassword: (inputPassword: string) => boolean;
    hashPassword: () => void;
};

const userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        passwordResetExpires: Date,
        passwordResetToken: String,
        privilege: {
            type: String,
            required: true,
            validate: (value: any) => {
                return ["Admin", "Coach", "Student"].indexOf(value) !== -1;
            }
        },
        verified: { type: Boolean, default: false },

        profile: {
            email: { type: String, unique: true },
            avatar: String,
            gender: String,
            name: String
        }
    },
    { timestamps: true }
);

userSchema.methods.hashPassword = async function() {
    const user: UserType = this as UserType;
    user.password = await bcrypt.hash(user.password, 10);
};

userSchema.methods.comparePassword = function(inputPassword: string): boolean {
    return bcrypt.compareSync(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
