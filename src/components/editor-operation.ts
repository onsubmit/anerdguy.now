const editorOperationNames = ['focus', 'copy', 'cut', 'paste', 'delete'] as const;
export type EditorOperationName = (typeof editorOperationNames)[number];
export type EditorOperations = {
  [K in EditorOperationName]: () => void;
};

export function isEditorOperation(operation: any): operation is EditorOperationName {
  return editorOperationNames.includes(operation);
}
