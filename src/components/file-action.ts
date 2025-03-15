const fileActions = ['open'] as const;
export type FileAction = (typeof fileActions)[number];

export function isFileAction(action: any): action is FileAction {
  return fileActions.includes(action);
}
