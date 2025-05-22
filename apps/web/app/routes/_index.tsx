import { client } from '../server';
import type { Route } from './+types/_index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function loader() {
  const new_data = await client.get.query();
  console.log('new_data', typeof new_data);
  return {
    data: new_data,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const id = loaderData?.data?.id;
  return (
    <div>
      <h1 className="font-serif text-2xl">ID: {id}</h1>
    </div>
  );
}