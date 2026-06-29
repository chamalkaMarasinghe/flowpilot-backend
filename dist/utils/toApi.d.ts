import type { Document, Types } from "mongoose";
import type { ApiTaskShape } from "./dashboardUtils.js";
import { type UserPreferencesShape } from "./userPreferences.js";
type WithId = {
    _id: Types.ObjectId;
};
export declare function toId(doc: WithId | Types.ObjectId | string | null | undefined): string;
export declare function toApiUser<T extends Document & WithId>(doc: T): {
    id: string;
    createdAt: string;
    updatedAt: string;
};
export declare function toApiAuthUser<T extends Document & WithId>(doc: T): {
    preferences: UserPreferencesShape;
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    jobTitle?: string;
    department?: string;
};
export declare function toApiTask<T extends Document & WithId>(doc: T): ApiTaskShape;
export {};
//# sourceMappingURL=toApi.d.ts.map