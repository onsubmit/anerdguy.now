const viewActions = ['toggle-editor'] as const;
export type ViewAction = (typeof viewActions)[number];

export function isViewAction(action: any): action is ViewAction {
  return viewActions.includes(action);
}
