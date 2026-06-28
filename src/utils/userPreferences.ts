export type TableViewPreference = "table" | "card";
export type ThemePreference = "light" | "dark";

export interface UserPreferencesShape {
  sidebarOpen: boolean;
  tableView: TableViewPreference;
  theme: ThemePreference;
}

export const DEFAULT_USER_PREFERENCES: UserPreferencesShape = {
  sidebarOpen: true,
  tableView: "table",
  theme: "light",
};

export function normalizePreferences(input?: Partial<UserPreferencesShape> | null): UserPreferencesShape {
  return {
    sidebarOpen: input?.sidebarOpen ?? DEFAULT_USER_PREFERENCES.sidebarOpen,
    tableView: input?.tableView ?? DEFAULT_USER_PREFERENCES.tableView,
    theme: input?.theme ?? DEFAULT_USER_PREFERENCES.theme,
  };
}
