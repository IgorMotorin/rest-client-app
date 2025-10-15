import { notFound } from 'next/navigation';
import { use } from 'react';
import Rest from '@/app/[locale]/(protected)/[...rest]/Rest';
import { methods } from '@/accessory/constants';
import Variables from '@/app/[locale]/(protected)/[...rest]/Variables';

export default function CatchAllPage({
  params,
  searchParams,
}: {
  params: Promise<{ rest: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { rest } = use(params);
  const search = use(searchParams);

  if (methods.includes(rest[0].toLowerCase())) {
    return <Rest rest={rest} search={search}></Rest>;
  }
  if (rest[0] === 'variables') {
    return <Variables />;
  }
  notFound();
}
