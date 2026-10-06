import React from "react";
import { MessageService } from "@/services/messages/message.service";
import { MessageManager } from "@/components/admin/MessageManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await MessageService.getAllAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Contact Messages CMS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review incoming questions, inquiries, and messages from the public website contact form.
        </p>
      </div>

      <MessageManager initialMessages={messages as any} />
    </div>
  );
}
