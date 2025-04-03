import { useState } from "react";
import { axios_instance } from "../lib/axios";
import { errorToast } from "../lib/toast";

const useSubscribe = () => {
    const [subscribeLoading, setSubscribeLoading] = useState(false);

    const toggleSubscriptionStatus = async (channelId, callback) => {
      setSubscribeLoading(true);
      try {
        const response = await axios_instance.post(`/subscriptions/toggle-subscription-status/${channelId}`);
        if (![200, 201].includes(response?.status || response?.data?.status)) {
          errorToast("Error toggling subscription status");
          setSubscribeLoading(false);
          return;
        }
  
        callback(response?.data, null);
      } catch (error) {
        callback(null, error?.response?.data);
      } finally {
        setSubscribeLoading(false);
      }
    };

    const getChannelSubscribedStatus = async (channelId, callback) => {
      setSubscribeLoading(true);
      try {
        const response = await axios_instance.get(`/subscriptions/get-channel-subscribed-status/${channelId}`);
  
        if (![200, 201].includes(response?.status || response?.data?.status)) {
          if(APPUSER){
            errorToast("Error getting subscription status of the channel");
            return;
          }
          setSubscribeLoading(false);
          return;
        }
  
        callback(response?.data, null);
      } catch (error) {
        callback(null, error?.response?.data);
      } finally {
        setSubscribeLoading(false);
      }
    };

    return{
        toggleSubscriptionStatus,
        subscribeLoading,
        getChannelSubscribedStatus
    };
  };
  
  export default useSubscribe;
  