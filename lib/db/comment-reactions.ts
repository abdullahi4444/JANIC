import prisma from "@/lib/db/prisma";

export interface CommentReactionData {
  reactions: Record<string, number>;
  userReactions: string[];
}

let tableChecked = false;

export async function ensureReactionTable(): Promise<void> {
  if (tableChecked) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS CommentReaction (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        commentId VARCHAR(191) NOT NULL,
        visitorId VARCHAR(191) NOT NULL,
        emoji VARCHAR(32) NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        UNIQUE KEY uq_comment_visitor_emoji (commentId, visitorId, emoji),
        INDEX idx_commentId (commentId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    tableChecked = true;
  } catch (err) {
    console.error("Error creating CommentReaction table:", err);
  }
}

export async function getReactionsForComments(
  commentIds: string[],
  visitorId: string
): Promise<Record<string, CommentReactionData>> {
  const result: Record<string, CommentReactionData> = {};
  if (!commentIds || commentIds.length === 0) return result;

  // Initialize empty reactions for all requested comment IDs
  for (const id of commentIds) {
    result[id] = { reactions: {}, userReactions: [] };
  }

  try {
    await ensureReactionTable();

    // Safe sanitized comment IDs query
    const escapedIds = commentIds.map((id) => `'${id.replace(/'/g, "''")}'`).join(",");
    const rows = await prisma.$queryRawUnsafe<
      Array<{ commentId: string; emoji: string; visitorId: string }>
    >(`SELECT commentId, emoji, visitorId FROM CommentReaction WHERE commentId IN (${escapedIds})`);

    for (const row of rows) {
      const data = result[row.commentId];
      if (!data) continue;

      data.reactions[row.emoji] = (data.reactions[row.emoji] || 0) + 1;
      if (row.visitorId === visitorId && !data.userReactions.includes(row.emoji)) {
        data.userReactions.push(row.emoji);
      }
    }
  } catch (err) {
    console.error("Error fetching comment reactions:", err);
  }

  return result;
}

export async function toggleCommentReaction(
  commentId: string,
  visitorId: string,
  emoji: string
): Promise<CommentReactionData> {
  await ensureReactionTable();

  // Validate emoji
  const cleanEmoji = emoji.trim().slice(0, 8);
  if (!cleanEmoji) {
    throw new Error("Emoji is required");
  }

  // Check if reaction already exists
  const existing = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT id FROM CommentReaction WHERE commentId = ? AND visitorId = ? AND emoji = ? LIMIT 1`,
    commentId,
    visitorId,
    cleanEmoji
  );

  if (existing.length > 0) {
    // Delete reaction
    await prisma.$executeRawUnsafe(
      `DELETE FROM CommentReaction WHERE commentId = ? AND visitorId = ? AND emoji = ?`,
      commentId,
      visitorId,
      cleanEmoji
    );
  } else {
    // Insert reaction
    const id = `cr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await prisma.$executeRawUnsafe(
      `INSERT INTO CommentReaction (id, commentId, visitorId, emoji) VALUES (?, ?, ?, ?)`,
      id,
      commentId,
      visitorId,
      cleanEmoji
    );
  }

  // Fetch updated counts for this comment
  const rows = await prisma.$queryRawUnsafe<
    Array<{ emoji: string; visitorId: string }>
  >(
    `SELECT emoji, visitorId FROM CommentReaction WHERE commentId = ?`,
    commentId
  );

  const updated: CommentReactionData = { reactions: {}, userReactions: [] };
  for (const row of rows) {
    updated.reactions[row.emoji] = (updated.reactions[row.emoji] || 0) + 1;
    if (row.visitorId === visitorId && !updated.userReactions.includes(row.emoji)) {
      updated.userReactions.push(row.emoji);
    }
  }

  return updated;
}
