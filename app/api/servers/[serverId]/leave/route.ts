import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthroized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server Id is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            role: {
              notIn: [MemberRole.ADMIN],
            },
            profileId: profile.id,
          },
        },
      },

      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVE_ID_LEAVE_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
