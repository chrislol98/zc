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
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      age: 35,
      city: 'Toronto',
      country: 'Canada',
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Williams',
      age: 28,
      city: 'Sydney',
      country: 'Australia',
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      age: 42,
      city: 'Paris',
      country: 'France',
    },
    {
      id: 6,
      firstName: 'Emma',
      lastName: 'Davis',
      age: 31,
      city: 'Berlin',
      country: 'Germany',
    },
    {
      id: 7,
      firstName: 'James',
      lastName: 'Miller',
      age: 29,
      city: 'Tokyo',
      country: 'Japan',
    },
    {
      id: 8,
      firstName: 'Maria',
      lastName: 'Garcia',
      age: 33,
      city: 'Madrid',
      country: 'Spain',
    },
    {
      id: 9,
      firstName: 'Daniel',
      lastName: 'Wilson',
      age: 27,
      city: 'Rome',
      country: 'Italy',
    },
    {
      id: 10,
      firstName: 'Sophie',
      lastName: 'Taylor',
      age: 36,
      city: 'Amsterdam',
      country: 'Netherlands',
    },
    {
      id: 11,
      firstName: 'Lucas',
      lastName: 'Anderson',
      age: 39,
      city: 'Stockholm',
      country: 'Sweden',
    },
    {
      id: 12,
      firstName: 'Isabella',
      lastName: 'Martinez',
      age: 32,
      city: 'Barcelona',
      country: 'Spain',
    },
    {
      id: 13,
      firstName: 'Oliver',
      lastName: 'Thompson',
      age: 44,
      city: 'Dublin',
      country: 'Ireland',
    },
    {
      id: 14,
      firstName: 'Sophia',
      lastName: 'Lee',
      age: 26,
      city: 'Seoul',
      country: 'South Korea',
    },
    {
      id: 15,
      firstName: 'William',
      lastName: 'Clark',
      age: 38,
      city: 'Vancouver',
      country: 'Canada',
    },
    {
      id: 16,
      firstName: 'Ava',
      lastName: 'Rodriguez',
      age: 34,
      city: 'Mexico City',
      country: 'Mexico',
    },
    {
      id: 17,
      firstName: 'Ethan',
      lastName: 'White',
      age: 41,
      city: 'Singapore',
      country: 'Singapore',
    },
    {
      id: 18,
      firstName: 'Mia',
      lastName: 'Chen',
      age: 29,
      city: 'Shanghai',
      country: 'China',
    },
    {
      id: 19,
      firstName: 'Alexander',
      lastName: 'Kumar',
      age: 37,
      city: 'Mumbai',
      country: 'India',
    },
    {
      id: 20,
      firstName: 'Victoria',
      lastName: 'Petrov',
      age: 33,
      city: 'Moscow',
      country: 'Russia',
    },
    {
      id: 21,
      firstName: 'Victoria',
      lastName: 'Petrov',
      age: 33,
      city: 'Moscow',
      country: 'Russia',
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
