export const DEFAULT_USER_PREFERENCES = {
    sidebarOpen: true,
    tableView: "table",
    theme: "light",
};
export function normalizePreferences(input) {
    return {
        sidebarOpen: input?.sidebarOpen ?? DEFAULT_USER_PREFERENCES.sidebarOpen,
        tableView: input?.tableView ?? DEFAULT_USER_PREFERENCES.tableView,
        theme: input?.theme ?? DEFAULT_USER_PREFERENCES.theme,
    };
}
//# sourceMappingURL=userPreferences.js.map