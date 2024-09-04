import { Schema, model } from "mongoose";

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        Owner: {
            type: Schema.Types.ObjectID,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

export const Tweet = model("Tweet", tweetSchema);