import mongoose from "mongoose";

const isValidId = (value: any) => {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) {
        throw new Error("Invalid Id");
    }
    return true;
};

export { isValidId }