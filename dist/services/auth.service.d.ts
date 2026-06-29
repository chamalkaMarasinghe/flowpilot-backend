export declare function login(input: unknown): Promise<{
    user: {
        preferences: import("../utils/userPreferences.js").UserPreferencesShape;
        id: string;
        fullName: string;
        email: string;
        role: string;
        avatarUrl?: string;
        jobTitle?: string;
        department?: string;
    };
    token: string;
}>;
export declare function register(input: unknown): Promise<{
    user: {
        preferences: import("../utils/userPreferences.js").UserPreferencesShape;
        id: string;
        fullName: string;
        email: string;
        role: string;
        avatarUrl?: string;
        jobTitle?: string;
        department?: string;
    };
    token: string;
}>;
export declare function forgotPassword(input: unknown): Promise<{
    ok: true;
}>;
export declare function getMe(userId: string): Promise<{
    preferences: import("../utils/userPreferences.js").UserPreferencesShape;
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    jobTitle?: string;
    department?: string;
}>;
export declare function updateProfile(userId: string, input: unknown): Promise<{
    preferences: import("../utils/userPreferences.js").UserPreferencesShape;
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    jobTitle?: string;
    department?: string;
}>;
export declare function updatePreferences(userId: string, input: unknown): Promise<{
    preferences: import("../utils/userPreferences.js").UserPreferencesShape;
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    jobTitle?: string;
    department?: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map