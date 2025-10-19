import AllUsers from "@/components/all-users";
import MembersTable from "@/components/members-table";
import { getOrganizationBySlug } from "@/server/organizations";
import { getUsers } from "@/server/users";

type Params = Promise<{ slug: string }>;

export default async function OrganizationPage({ params }: { params: Params }) {
  const { slug } = await params;

  const organization = await getOrganizationBySlug(slug);
  const users = await getUsers(organization?.id || "");

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold">{organization?.name}</h1>
      <MembersTable members={organization?.members || []} />
      <AllUsers users={users} organizationId={organization?.id || ""} />
    </div>
  );
}
