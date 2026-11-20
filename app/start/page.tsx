import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Activate } from "./activate";
import { workspaceUrl } from "@/lib/workspace-navigation";

export default async function StartPage({ searchParams }: PageProps<"/start">) {
  const { orgId } = await auth.protect();
  const query = await searchParams;
  const repository = typeof query.repository === "string" ? query.repository : undefined;
  if (orgId) redirect(workspaceUrl(repository));

  return (
    <div className="flex flex-1 items-center justify-center">
      <Activate repository={repository} />
    </div>
  );
}
