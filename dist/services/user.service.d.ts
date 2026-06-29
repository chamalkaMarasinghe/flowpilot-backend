export declare function listUsers(): Promise<{
    id: string;
    createdAt: string;
    updatedAt: string;
}[]>;
export declare function setUserStatus(id: string, input: unknown, actorId: string): Promise<{
    id: string;
    createdAt: string;
    updatedAt: string;
}>;
export declare function setUserRole(id: string, input: unknown, actorId: string): Promise<{
    id: string;
    createdAt: string;
    updatedAt: string;
}>;
export declare function deleteUser(id: string, actorId: string): Promise<{
    id: string;
}>;
//# sourceMappingURL=user.service.d.ts.map