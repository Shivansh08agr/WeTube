import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

router
  .route("/toggle-subscription-status/:channelId")
  .post(verifyJWT, toggleSubscription);

router
  .route("/subscribers/:channelId")
  .get(verifyJWT, getUserChannelSubscribers);

router
  .route("/subscribed-channels/:channelId")
  .get(verifyJWT, getSubscribedChannels);

export default router;
