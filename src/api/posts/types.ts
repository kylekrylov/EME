export interface IPost {
  body: string;
  id: number;
  title: string;
  userId: number;
}

export interface IPostsPage {
  posts: IPost[];
  total: number | null;
}

export interface IGetPostsPageParams {
  limit: number;
  signal?: AbortSignal;
  start: number;
}
