import { json } from '@remix-run/node';
import { db } from '~/utils/db.server';
import {
  useLoaderData,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className='error-container'>
        <p>There are no jokes to display.</p>
        <Link to='new'>Add your own</Link>
      </div>
    );
  }
}

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });

  if (!randomJoke) {
    throw new Response('No random joke found', {
      status: 404,
    });
  }

  return json({ randomJoke });
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}
1;
