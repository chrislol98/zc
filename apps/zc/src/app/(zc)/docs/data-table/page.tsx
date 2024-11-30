import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function Page() {
  const data = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      city: 'New York',
      country: 'USA',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      age: 25,
      city: 'London',
      country: 'UK',
    },
  ];

  const columns: ColumnDef<(typeof data)[number]>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Personal Info',
      columns: [
        {
          header: 'First Name',
          accessorKey: 'firstName',
        },
        {
          header: 'Last Name',
          accessorKey: 'lastName',
        },
        {
          header: 'Age',
          accessorKey: 'age',
        },
      ],
    },
    {
      header: 'Location',
      columns: [
        {
          header: 'City',
          accessorKey: 'city',
        },
        {
          header: 'Country',
          accessorKey: 'country',
        },
      ],
    },
  ];

  return <DataTable data={data} columns={columns} />;
}
