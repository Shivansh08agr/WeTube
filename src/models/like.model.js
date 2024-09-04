import { Schema, model } from "mongoose";

const likeSchema = new Schema(
    {
        comment: {
            type: Schema.Types.ObjectID,
            ref: "Comment"
        },
        video: {
            type: Schema.Types.ObjectID,
            ref: "Video"
        },
        likedBy: {
            type: Schema.Types.ObjectID,
            ref: "User"
        },
        tweet: {
            type: Schema.Types.ObjectID,
            ref: "Tweet"
        }
    },
    {
        timestamps: true
    }
);

export const Like = model("Like", likeSchema);