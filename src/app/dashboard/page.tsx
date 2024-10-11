import { getLocations } from "@/actions/locations";
import { format } from "date-fns";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Location } from "@/types/location";

const Page = async () => {
  const locations = await getLocations();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Locations Dashboard
      </h1>
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white border border-gray-200 shadow-md">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-4 py-2 text-left font-semibold text-gray-700">
                Title
              </TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold text-gray-700">
                Address
              </TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold text-gray-700">
                Date Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location: Location) => (
              <TableRow
                key={location.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <TableCell className="px-4 py-2 text-gray-700">
                  {location.title}
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-700">
                  {location.address}
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-700">
                  {location.status}
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-700">
                  {format(new Date(location.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
