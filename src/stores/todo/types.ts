import type { TODO_FILTERS } from './constants';

export interface ITodoTask {
  id: string;
  isCompleted: boolean;
  title: string;
}

export interface ITodoStorageState {
  tasks: ITodoTask[];
  version: number;
}

export type TTodoFilter = (typeof TODO_FILTERS)[keyof typeof TODO_FILTERS];
