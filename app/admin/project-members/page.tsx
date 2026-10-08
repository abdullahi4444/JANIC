import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminProjectMembersPage() {
  redirect("/admin/projects?tab=teams");
}

