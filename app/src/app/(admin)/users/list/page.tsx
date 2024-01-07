import { MainLayout } from "@/components/app-layout";
import AdminPage from "@/components/role/admin";
import { H1 } from "@/components/ui/typography";
import { Role } from "@prisma/client";
import { z } from "zod";
import { api } from "~/trpc/server";
import UserTable from "./table";
import TableFilter from "./tableFilter";

export type UsersListProps = {
  searchParams: {
    page?: string;
    email?: string;
    role?: string;
  };
};

const searchParamsSchema = z.object({
  page: z.string().optional(),
  email: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
});

const parseSearchParams = (searchParams: UsersListProps["searchParams"]) => {
  try {
    return searchParamsSchema.parse(searchParams);
  } catch (error) {
    return searchParamsSchema.parse({
      page: searchParams.page,
      email: searchParams.email,
    });
  }
};

const UsersList = async ({ searchParams }: UsersListProps) => {
  searchParams = parseSearchParams(searchParams);

  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const size = 10;
  const query = {
    page,
    size,
    query: {
      email: searchParams.email,
      role: searchParams.role as Role,
    },
  };
  const { users, count } = await api.users.getAll.query(query);

  return (
    <MainLayout>
      <div className="space-y-6">
        <H1>Users</H1>
        <TableFilter searchParams={searchParams} />
        <UserTable
          data={users}
          page={page}
          size={size}
          totalCount={count}
          searchParams={searchParams}
        />
      </div>
    </MainLayout>
  );
};

export default function UsersListPage(props: UsersListProps) {
  return (
    <AdminPage>
      <UsersList {...props} />
    </AdminPage>
  );
}
