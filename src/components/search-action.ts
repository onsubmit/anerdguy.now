const searchActions = ['find-again'] as const;
export type SearchAction = (typeof searchActions)[number];

export function isSearchAction(action: any): action is SearchAction {
  return searchActions.includes(action);
}
