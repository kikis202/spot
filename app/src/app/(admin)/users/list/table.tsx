import Paginator from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import ManageUser from "./manage";

import type { RouterOutputs } from "~/trpc/shared";
import type { UsersListProps } from "./page";

type User = RouterOutputs["users"]["getAll"]["users"][number];
type UserTableParams = {
  data: User[];
  page: number;
  size: number;
  totalCount: number;
};

const UserTable = ({
  data,
  page,
  size,
  totalCount,
  searchParams,
}: UserTableParams & UsersListProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Registered at</TableHead>
            <TableHead className="w-28 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell className="font-medium">{user.role}</TableCell>
              <TableCell className="font-medium">
                {moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </TableCell>
              <TableCell className="text-right">
                <ManageUser id={user.id} role={user.role} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {totalCount > size && (
          <TableFooter>
            <TableRow>
              <TableCell className="!py-2" colSpan={6}>
                <Paginator
                  currentPage={page}
                  size={size}
                  totalCount={totalCount}
                  searchParams={searchParams}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableCaption>Select parcels and asign them to yourself</TableCaption>
      </Table>
    </>
  );
};

export default UserTable;
