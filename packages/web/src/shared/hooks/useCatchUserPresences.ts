import { useEffect } from "react";
import { useStore } from "@stores/index";
import { supabaseClient } from "@shared/utils";
import { useAuthStore } from "@stores/index";

export const useCatchUserPresences = () => {
  const profile = useAuthStore((state) => state.profile);
  const { workspaceId } = useStore((state) => state.workspaceSettings);
  const setOrUpdateUserPresence = useStore((state) =>
    state.setOrUpdateUserPresence
  );
  const setWorkspaceSetting = useStore((state) => state.setWorkspaceSetting);
  const removeUserPresence = useStore((state) => state.removeUserPresence);

  useEffect(() => {
    if (!workspaceId || !profile) return;

    const messageSubscription = supabaseClient
      .channel(`workspace_presence:${workspaceId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on("presence", { event: "sync" }, () => {
        // const newState = messageSubscription.presenceState();
        // console.log("sync", newState);
        // newState.forEach((value: any, key: any) => {
        //   channelUsersPresence.set(key, value);
        // }
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // add the user into the channel member state store
        // if the user is not in the channel member state store
        // console.log("join", { key, newPresences });
        // if (usersPresence.has(newPresences.at(0)?.id)) return;
        const newUser: any = {
          ...newPresences.at(0),
          status: "ONLINE",
        };
        setOrUpdateUserPresence(newPresences.at(0)?.id, newUser);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        // console.log("leave", key, leftPresences);
        // update user status to offline in the channel member state store
        // if the user is in the channel member state store
        // if (!usersPresence.has(leftPresences.at(0)?.id)) return;
        const newUser: any = {
          ...leftPresences.at(0),
          status: "OFFLINE",
        };
        setOrUpdateUserPresence(leftPresences.at(0)?.id, newUser);
      })
      .on("broadcast", { event: "presenceSync" }, (data) => {
        const usersPresence = useStore.getState().usersPresence;
        const payload = data.payload;
        if (!payload.length) return;

        payload.forEach((user: any) => {
          const newUser: any = {
            ...usersPresence.get(user.id),
            ...user,
          };
          setOrUpdateUserPresence(user.id, newUser);
        });
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        // console.log("SUBSCRIBED", { status, profile });
        // broadcast user presence
        await messageSubscription.track(profile);
        setWorkspaceSetting("workspaceBroadcaster", messageSubscription);
      });

    // TODO: channle Events Gateway
    // document.addEventListener("channel:events", (e) => {
    //   const eventType = e.detail.eventType;
    //   const eventPayload = e.detail.eventPayload;
    // });
    return () => {
      messageSubscription?.unsubscribe();
    };
  }, [profile, workspaceId]);
};
