import { Schema, model } from "mongoose";

var subscriptionSchema = new Schema(
  {
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
      type: Schema.Types.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

export const Subscription = model("Subscription", subscriptionSchema);
