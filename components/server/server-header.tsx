"use client";

import { ServerWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

interface ServerHeaderProps {
  server: ServerWithProfiles;
  role?: MemberRole;
}

export const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
  return <></>;
};
