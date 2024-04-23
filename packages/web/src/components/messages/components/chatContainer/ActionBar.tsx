import { ChannelActionBar } from "../ChannelActionBar";
import { twMerge } from "tailwind-merge";

export const ActionBar = ({ className }: any) => {
  return (
    <div className={twMerge("mt-auto w-full", className)}>
      <ChannelActionBar />
    </div>
  );
};
