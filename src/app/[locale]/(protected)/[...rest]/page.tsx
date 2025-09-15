import { notFound } from 'next/navigation';
import { use } from 'react';
import Rest from '@/components/rest/Rest';

export default function CatchAllPage({
  params,
}: {
  params: Promise<{ rest: string }>;
}) {
  const { rest } = use(params);

  if (rest[0] === 'rest') {
    return <Rest method={rest[1]}></Rest>;
  }
  notFound();
}
