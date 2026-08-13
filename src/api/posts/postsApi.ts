import type { IGetPostsPageParams, IPost, IPostsPage } from './types';

import { getJson } from '@/api/httpClient';

import { POSTS_RESOURCE, TOTAL_COUNT_HEADER } from './constants';

export async function getPostsPage({ limit, signal, start }: IGetPostsPageParams) {
  const { data, headers } = await getJson<IPost[]>(POSTS_RESOURCE, {
    query: {
      _limit: limit,
      _start: start,
    },
    signal,
  });

  const totalHeader = headers.get(TOTAL_COUNT_HEADER);
  const parsedTotal = totalHeader === null ? Number.NaN : Number(totalHeader);

  return {
    posts: data,
    total: Number.isFinite(parsedTotal) ? parsedTotal : null,
  } satisfies IPostsPage;
}
