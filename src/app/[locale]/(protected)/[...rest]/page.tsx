import { notFound } from 'next/navigation';
import { use } from 'react';
import Rest from '@/components/rest/Rest';
import { methods } from '@/accessory/constants';

export default function CatchAllPage({
  params,
}: {
  params: Promise<{ rest: string }>;
}) {
  const { rest } = use(params);

  if (methods.includes(rest[0])) {
    return <Rest method={rest[0]}></Rest>;
  }
  notFound();
}
