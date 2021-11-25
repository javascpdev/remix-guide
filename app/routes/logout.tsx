import type { ActionFunction, LoaderFunction } from 'remix';
import { notFound } from '~/helpers';

export let action: ActionFunction = async ({ context }) => {
  return await context.auth.logout();
};

export let loader: LoaderFunction = () => {
  return notFound();
};
