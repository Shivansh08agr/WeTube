import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { getChannelSubscribedStatus, getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

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

  router
  .route('/get-channel-subscribed-status/:channelId')
  .get(verifyJWT, getChannelSubscribedStatus);

export default router;
