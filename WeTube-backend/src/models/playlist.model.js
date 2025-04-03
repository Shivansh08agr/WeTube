import { Schema, model } from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        video: [
            {
                type: Schema.Types.ObjectID,
                ref: "Video"
            }
        ],
        owner: {
            type: Schema.Types.ObjectID,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

export const Playlist = model("Playlist", playlistSchema);