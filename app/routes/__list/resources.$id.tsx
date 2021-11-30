import type { HeadersFunction, LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import { notFound } from '~/helpers';
import { Entry } from '~/types';
import List from '~/components/List';
import { Link as LinkIcon } from '~/icons/link';
import { User as UserIcon } from '~/icons/user';

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
};

export let loader: LoaderFunction = async ({ context, params }) => {
  const [category, ...rest] = params.id.split('-');
  const slug = rest.join('-');
  const entry = await context.query(category, slug);

  if (!entry) {
    throw notFound();
  }

  return json(
    {
      category,
      slug,
      entry,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    }
  );
};

export default function EntryDetail() {
  const { entry } =
    useLoaderData<{ category: string; slug: string; entry: Entry }>();

  return (
    <List title={entry.title}>
      <div className="max-w-screen-xl divide-y">
        <div className="px-3 pt-3 pb-8">
          <div className="flex flex-col xl:flex-row justify-between gap-8 2xl:gap-12">
            <div className="pt-0.5 flex-1">
              <div className="text-xs pb-1.5 text-gray-500">
                {`${entry.date ?? new Date().toISOString()}`.substr(0, 10)}
              </div>
              <a href={entry.url} target="_blank" rel="noopener noreferrer">
                <h2 className="text-xl break-words">{entry.title}</h2>
              </a>
              <a
                className="hover:underline text-gray-400"
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="inline-block w-3 h-3 mr-2" />
                {new URL(entry.url).hostname}
              </a>
              {!entry.description ? null : (
                <p className="pt-6 text-gray-500 text-sm">
                  {entry.description}
                </p>
              )}
            </div>
            <div className="xl:max-w-xs w-auto">
              {entry.category === 'videos' && entry.video ? (
                <div className="pt-1 w-full xl:w-64">
                  <div
                    className="relative h-0"
                    style={{ paddingBottom: '56.25%' }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      width="480"
                      height="270"
                      src={entry.video}
                      title={entry.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : entry.image ? (
                <a
                  className="relative"
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="max-h-96 rounded-lg bg-white"
                    src={entry.image}
                    width="auto"
                    height="auto"
                    alt="cover"
                  />
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div className="px-3 py-8"></div>
      </div>
    </List>
  );
}
