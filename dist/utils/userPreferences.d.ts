export type TableViewPreference = "table" | "card";
export type ThemePreference = "light" | "dark";
export interface UserPreferencesShape {
    sidebarOpen: boolean;
    tableView: TableViewPreference;
    theme: ThemePreference;
}
export declare const DEFAULT_USER_PREFERENCES: UserPreferencesShape;
export declare function normalizePreferences(input?: Partial<UserPreferencesShape> | null): UserPreferencesShape;
//# sourceMappingURL=userPreferences.d.ts.map