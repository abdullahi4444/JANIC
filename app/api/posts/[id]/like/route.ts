import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  const [count, mine] = await Promise.all([
    prisma.mediaLike.count({ where: { mediaId: id } }),
    user
      ? prisma.mediaLike.findUnique({
          where: { mediaId_visitorId: { mediaId: id, visitorId: user.id } },
        })
      : null,
  ]);
  return NextResponse.json({ count, liked: !!mine });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED", message: "Please sign in to like posts" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const existing = await prisma.mediaLike.findUnique({
    where: { mediaId_visitorId: { mediaId: id, visitorId: user.id } },
  });

  let liked = false;
  if (existing) {
    await prisma.mediaLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.mediaLike.create({ data: { mediaId: id, visitorId: user.id } });
    liked = true;
  }

  const count = await prisma.mediaLike.count({ where: { mediaId: id } });
  return NextResponse.json({ success: true, liked, count });
}
