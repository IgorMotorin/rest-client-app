import { notFound } from 'next/navigation';
import { use } from 'react';
import Rest from '@/app/[locale]/(protected)/[...rest]/Rest';
import { methods } from '@/accessory/constants';
import Variables from '@/app/[locale]/(protected)/[...rest]/Variables';

export default function CatchAllPage({
  params,
}: {
  params: Promise<{ rest: string }>;
}) {
  const { rest } = use(params);

  if (methods.includes(rest[0])) {
    return <Rest method={rest[0]}></Rest>;
  }
  if (rest[0] === 'variables') {
    return <Variables />;
  }
  notFound();
}
