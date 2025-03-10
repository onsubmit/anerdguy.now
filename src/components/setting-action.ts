const settingActions = ['open-colors-dialog'] as const;
export type SettingAction = (typeof settingActions)[number];
export type SettingActions = {
  [K in SettingAction]: () => void;
};

export function isSettingAction(action: any): action is SettingAction {
  return settingActions.includes(action);
}
