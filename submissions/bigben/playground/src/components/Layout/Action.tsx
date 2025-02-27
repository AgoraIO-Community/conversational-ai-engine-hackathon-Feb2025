"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation"; // For reading query params

// Correct imports for these two actions:
import { setAgentConnected, setMobileActiveTab } from "@/store/reducers/global";

// The rest from "@/common" as appropriate
import {
  useAppDispatch,
  useAppSelector,
  useIsCompactLayout,
  apiPing,
  MOBILE_ACTIVE_TAB_MAP,
  EMobileActiveTab,
} from "@/common";

import { LoadingButton } from "@/components/Button/LoadingButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { rtcManager } from "@/manager";
import { rtmManager } from "@/manager";
import { toast } from "sonner";

let intervalId: NodeJS.Timeout | null = null;

export default function Action(props: { className?: string }) {
  const { className } = props;
  const dispatch = useAppDispatch();

  // -- Global states
  const agentConnected = useAppSelector((state) => state.global.agentConnected);
  const channelFromStore = useAppSelector((state) => state.global.options.channel);
  const mobileActiveTab = useAppSelector((state) => state.global.mobileActiveTab);

  // -- Local loading state
  const [loading, setLoading] = React.useState(false);

  // -- Local input states
  const [localAppId, setLocalAppId] = React.useState("");
  const [localToken, setLocalToken] = React.useState("");
  const [localChannel, setLocalChannel] = React.useState("");
  const [localUserId, setLocalUserId] = React.useState("");

  // -- For reading query params
  const searchParams = useSearchParams();
  const isCompactLayout = useIsCompactLayout(); // Will be true on narrower screens

  React.useEffect(() => {
    // On component mount, read values from URL if present
    const appIdParam = searchParams.get("appId");
    const tokenParam = searchParams.get("token");
    const channelParam = searchParams.get("channel");
    const userIdParam = searchParams.get("userId");

    if (appIdParam) setLocalAppId(appIdParam);
    if (tokenParam) setLocalToken(tokenParam);
    if (channelParam) setLocalChannel(channelParam);
    if (userIdParam) setLocalUserId(userIdParam);
  }, [searchParams]);

  React.useEffect(() => {
    // Once we have the channel from store, check if the agent is connected
    if (channelFromStore) {
      checkAgentConnected();
    }
  }, [channelFromStore]);

  const checkAgentConnected = async () => {
    const res: any = await apiPing(channelFromStore);
    if (res?.code === 0) {
      dispatch(setAgentConnected(true));
    }
  };

  const onClickConnect = async () => {
    if (loading) return;
    setLoading(true);

    if (agentConnected) {
      // If already connected, disconnect
      dispatch(setAgentConnected(false));
      await rtcManager.leave();
    } else {
      // Connect with the user-entered (or query-param) values

      rtmManager.init({
        appId: localAppId,
        token: localToken,
        channel: localChannel,
        userId: parseInt(localUserId, 10),
      }
    );
      try {
        await rtcManager.join2({
          appId: localAppId,
          token: localToken,
          channel: localChannel,
          userId: parseInt(localUserId, 10),
        });
        await rtcManager.publish();
        dispatch(setAgentConnected(true));
      } catch (err) {
        toast.error("Failed to join channel");
        console.error(err);
      }
    }

    setLoading(false);
  };

  const startPing = () => {
    if (intervalId) {
      stopPing();
    }
    intervalId = setInterval(() => {
      apiPing(channelFromStore);
    }, 3000);
  };

  const stopPing = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const onChangeMobileActiveTab = (tab: string) => {
    dispatch(setMobileActiveTab(tab as EMobileActiveTab));
  };

  return (
    <>
      {/* Action Bar */}
      <div
        className={cn(
          "mx-2 mt-2 flex items-center justify-between rounded-t-lg bg-[#181a1d] p-2 md:m-2 md:rounded-lg",
          className
        )}
      >
        {/* -- Description Part (hidden on small screens) */}
        <div className="hidden md:block">
          <span className="text-sm font-bold"></span>
          <span className="ml-0 whitespace-nowrap text-xs text-muted-foreground">
Hackathon by BigBen
          </span>
        </div>

        <Tabs
          defaultValue={mobileActiveTab}
          className="w-[400px] md:hidden"
          onValueChange={onChangeMobileActiveTab}
        >
          <TabsList>
            {Object.values(EMobileActiveTab).map((tab) => (
              <TabsTrigger key={tab} value={tab} className="w-24 text-sm">
                {MOBILE_ACTIVE_TAB_MAP[tab]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* -- Inputs & Action Button */}
        <div className="ml-auto flex items-center gap-2">
          {/* Hide these inputs entirely on compact layout */}
          {!isCompactLayout && (
            <>
              <input
                type="text"
                placeholder="appId"
                value={localAppId}
                onChange={(e) => setLocalAppId(e.target.value)}
                className="w-24 rounded-md border border-muted-foreground bg-transparent px-2 py-1 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="token"
                value={localToken}
                onChange={(e) => setLocalToken(e.target.value)}
                className="w-24 rounded-md border border-muted-foreground bg-transparent px-2 py-1 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="channel"
                value={localChannel}
                onChange={(e) => setLocalChannel(e.target.value)}
                className="w-24 rounded-md border border-muted-foreground bg-transparent px-2 py-1 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="userId"
                value={localUserId}
                onChange={(e) => setLocalUserId(e.target.value)}
                className="w-24 rounded-md border border-muted-foreground bg-transparent px-2 py-1 text-sm focus:outline-none"
              />
            </>
          )}

          {/* Connect/Disconnect Button */}
          <LoadingButton
            onClick={onClickConnect}
            variant={!agentConnected ? "default" : "destructive"}
            size="sm"
            className="min-w-24 w-fit"
            loading={loading}
            svgProps={{ className: "h-4 w-4 text-muted-foreground" }}
          >
            {loading
              ? "Connecting"
              : !agentConnected
              ? "Connect"
              : "Disconnect"}
          </LoadingButton>
        </div>
      </div>
    </>
  );
}
