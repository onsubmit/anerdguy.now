const editorOperationNames = [
  'focus',
  'copy',
  'cut',
  'paste',
  'delete',
  'find',
  'replace',
] as const;
export type EditorOperationName = (typeof editorOperationNames)[number];
export type EditorOperations = {
  [K in EditorOperationName]: K extends keyof NonTrivialOperations
    ? NonTrivialOperations[K]
    : () => void;
};

export type FindParams = {
  value: string;
  replaceWith: string | null;
  matchWord: boolean;
  matchCase: boolean;
};

export type NonTrivialOperations = {
  find: (params: FindParams & { replaceAll?: boolean }) => void;
  replace: (params: FindParams & { replaceAll: boolean }) => void;
};

export function isEditorOperation(operation: any): operation is EditorOperationName {
  return editorOperationNames.includes(operation);
}
