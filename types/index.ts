import { Memeber, Profile } from "@prisma/client";
import { Server } from "@prisma/client";

export type ServerWithProfiles = Server & {
  members: (Memeber & { profile: Profile })[];
};
