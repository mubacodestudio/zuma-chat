import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = async ({
  serverId,
}) => {
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      Channels: {
        orderBy: {
          createdAt: "asc",
        },
      },

      members: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const textChannel = server?.Channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannel = server?.Channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannel = server?.Channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    redirect("/");
  }

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};
