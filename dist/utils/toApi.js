import { normalizePreferences } from "./userPreferences.js";
export function toId(doc) {
    if (!doc)
        return "";
    if (typeof doc === "string")
        return doc;
    if ("_id" in doc && doc._id)
        return String(doc._id);
    return String(doc);
}
export function toApiUser(doc) {
    const obj = doc.toObject({ virtuals: false });
    const { _id, passwordHash: _, ...rest } = obj;
    return {
        ...rest,
        id: String(_id),
        createdAt: obj.createdAt.toISOString(),
        updatedAt: obj.updatedAt.toISOString(),
    };
}
export function toApiAuthUser(doc) {
    const user = toApiUser(doc);
    const { status: _, createdAt: __, updatedAt: ___, preferences, ...auth } = user;
    return {
        ...auth,
        preferences: normalizePreferences(preferences),
    };
}
export function toApiTask(doc) {
    const obj = doc.toObject({ virtuals: false });
    const { _id, createdBy, assignedTo, dueDate, ...rest } = obj;
    return {
        ...rest,
        id: String(_id),
        createdBy: toId(createdBy),
        assignedTo: toId(assignedTo),
        dueDate: dueDate.toISOString(),
        createdAt: obj.createdAt.toISOString(),
        updatedAt: obj.updatedAt.toISOString(),
    };
}
//# sourceMappingURL=toApi.js.map