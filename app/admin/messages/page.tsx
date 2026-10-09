/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { requireAuth } from "@/lib/permissions/roles";
import { KpiRow } from "@/components/admin/KpiRow";
import { MessageService } from "@/services/messages/message.service";
import { MessageManager } from "@/components/admin/MessageManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await requireAuth(null, "messages:read");
  const messages = await MessageService.getAllAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Contact Messages CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review incoming questions, inquiries, and messages from the public website contact form.
        </p>
      </div>

      <KpiRow items={[
      { title: "Total", value: messages.length, sub: "all messages" },
      { title: "Unread", value: messages.filter((m) => m.status === "UNREAD").length, sub: "need reply" },
      { title: "Read", value: messages.filter((m) => m.status === "READ").length, sub: "reviewed" },
      { title: "Replied", value: messages.filter((m) => m.status === "REPLIED").length, sub: "answered" },
    ]} />

      <MessageManager initialMessages={messages as any} />
    </div>
  );
}
