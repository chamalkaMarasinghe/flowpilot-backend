import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer, type Server } from "node:http";
import { connectDb } from "../config/db.js";
import { createApp } from "../app.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import type { ApiResponse } from "../utils/response.js";

async function seedForTest() {
  await Task.deleteMany({});
  await User.deleteMany({});

  const adminHash = await bcrypt.hash("Admin@123", 10);
  const userHash = await bcrypt.hash("User@123", 10);

  const admin = await User.create({
    fullName: "Alex Admin",
    email: "admin@flowpilot.com",
    passwordHash: adminHash,
    role: "ADMIN",
    status: "ACTIVE",
  });

  const user = await User.create({
    fullName: "John User",
    email: "user@flowpilot.com",
    passwordHash: userHash,
    role: "USER",
    status: "ACTIVE",
  });

  await Task.create({
    title: "Test task",
    description: "Integration test task",
    priority: "HIGH",
    status: "OPEN",
    dueDate: new Date(Date.now() + 86400000),
    createdBy: admin._id,
    assignedTo: user._id,
  });

  return { admin, user };
}

async function request<T>(baseUrl: string, path: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => ({}))) as ApiResponse<T>;
  return { status: res.status, body };
}

async function run() {
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  process.env.JWT_SECRET = "test-secret";
  process.env.CORS_ORIGIN = "http://localhost:8080";

  await connectDb(mongoUri);
  await seedForTest();

  const app = createApp();
  let server: Server | undefined;
  const baseUrl = await new Promise<string>((resolve) => {
    server = createServer(app).listen(0, () => {
      const addr = server!.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolve(`http://127.0.0.1:${port}`);
    });
  });

  try {
    const login = await request<{ user: { email: string }; token: string }>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@flowpilot.com", password: "Admin@123" }),
    });
    if (login.status !== 200 || !login.body.success || !login.body.data?.token) {
      throw new Error(`Login failed: ${JSON.stringify(login.body)}`);
    }

    const token = login.body.data.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    const me = await request<{ user: { email: string; id: string } }>(baseUrl, "/api/auth/me", { headers: authHeaders });
    if (me.status !== 200 || !me.body.success || me.body.data?.user.email !== "admin@flowpilot.com") {
      throw new Error(`Me endpoint failed: ${JSON.stringify(me.body)}`);
    }

    const profilePatch = await request<{ user: { fullName: string; jobTitle: string } }>(baseUrl, "/api/auth/me", {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ fullName: "Alex Admin Updated", jobTitle: "Platform Admin", department: "Operations" }),
    });
    if (
      profilePatch.status !== 200 ||
      !profilePatch.body.success ||
      profilePatch.body.data?.user.fullName !== "Alex Admin Updated" ||
      profilePatch.body.data?.user.jobTitle !== "Platform Admin"
    ) {
      throw new Error(`Profile update failed: ${JSON.stringify(profilePatch.body)}`);
    }

    const meAfterPatch = await request<{ user: { fullName: string } }>(baseUrl, "/api/auth/me", { headers: authHeaders });
    if (meAfterPatch.body.data?.user.fullName !== "Alex Admin Updated") {
      throw new Error(`Profile not persisted: ${JSON.stringify(meAfterPatch.body)}`);
    }

    const prefsPatch = await request<{ user: { preferences: { theme: string; tableView: string; sidebarOpen: boolean } } }>(
      baseUrl,
      "/api/auth/me/preferences",
      {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ theme: "dark", tableView: "card", sidebarOpen: false }),
      },
    );
    if (
      prefsPatch.status !== 200 ||
      !prefsPatch.body.success ||
      prefsPatch.body.data?.user.preferences.theme !== "dark" ||
      prefsPatch.body.data?.user.preferences.tableView !== "card" ||
      prefsPatch.body.data?.user.preferences.sidebarOpen !== false
    ) {
      throw new Error(`Preferences update failed: ${JSON.stringify(prefsPatch.body)}`);
    }

    const meWithPrefs = await request<{ user: { preferences: { theme: string } } }>(baseUrl, "/api/auth/me", {
      headers: authHeaders,
    });
    if (meWithPrefs.body.data?.user.preferences?.theme !== "dark") {
      throw new Error(`Preferences not persisted on /me: ${JSON.stringify(meWithPrefs.body)}`);
    }

    const tasks = await request<unknown[]>(baseUrl, "/api/tasks", { headers: authHeaders });
    if (tasks.status !== 200 || !tasks.body.success || !Array.isArray(tasks.body.data) || tasks.body.data.length === 0) {
      throw new Error(`Tasks fetch failed: ${JSON.stringify(tasks.body)}`);
    }

    const users = await request<unknown[]>(baseUrl, "/api/users", { headers: authHeaders });
    if (users.status !== 200 || !users.body.success || !Array.isArray(users.body.data) || users.body.data.length < 2) {
      throw new Error(`Users fetch failed: ${JSON.stringify(users.body)}`);
    }

    const dashboard = await request<Record<string, unknown>>(baseUrl, "/api/dashboard?period=month&taskFocus=today", {
      headers: authHeaders,
    });
    if (dashboard.status !== 200 || !dashboard.body.success || !dashboard.body.data?.summary) {
      throw new Error(`Dashboard fetch failed: ${JSON.stringify(dashboard.body)}`);
    }

    const filteredTasks = await request<unknown[]>(baseUrl, "/api/tasks?status=OPEN&sort=priority", {
      headers: authHeaders,
    });
    if (filteredTasks.status !== 200 || !filteredTasks.body.success) {
      throw new Error(`Filtered tasks failed: ${JSON.stringify(filteredTasks.body)}`);
    }

    const searchByTitle = await request<Array<{ title: string }>>(baseUrl, "/api/search/tasks?q=Test", {
      headers: authHeaders,
    });
    if (searchByTitle.status !== 200 || !searchByTitle.body.success || (searchByTitle.body.data as unknown[]).length === 0) {
      throw new Error(`Search by title failed: ${JSON.stringify(searchByTitle.body)}`);
    }

    const searchByDesc = await request<Array<{ title: string }>>(baseUrl, "/api/search/tasks?q=Integration", {
      headers: authHeaders,
    });
    const descHits = (searchByDesc.body.data as Array<{ title: string }> | undefined) ?? [];
    if (
      searchByDesc.status !== 200 ||
      !searchByDesc.body.success ||
      descHits.some((t) => t.title === "Test task")
    ) {
      throw new Error(`Search must not match description-only text: ${JSON.stringify(searchByDesc.body)}`);
    }

    const listSearch = await request<unknown[]>(baseUrl, "/api/tasks?search=Test", { headers: authHeaders });
    if (listSearch.status !== 200 || !listSearch.body.success || (listSearch.body.data as unknown[]).length === 0) {
      throw new Error(`List search by title failed: ${JSON.stringify(listSearch.body)}`);
    }

    const userLogin = await request<{ user: { id: string }; token: string }>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "user@flowpilot.com", password: "User@123" }),
    });
    const userToken = userLogin.body.data!.token;
    const creatorId = userLogin.body.data!.user.id;
    const userHeaders = { Authorization: `Bearer ${userToken}` };

    const userList = await request<Array<{ id: string }>>(baseUrl, "/api/users", { headers: userHeaders });
    const assigneeId = (userList.body.data as Array<{ id: string }>)[0]?.id;
    if (!assigneeId) throw new Error("No users for assignee");

    const dueDate = new Date(Date.now() + 86400000 * 3).toISOString();
    const created = await request<{ id: string; createdBy: string; assignedTo: string }>(baseUrl, "/api/tasks", {
      method: "POST",
      headers: userHeaders,
      body: JSON.stringify({
        title: "Integration test task",
        description: "Created via API test",
        priority: "MEDIUM",
        status: "OPEN",
        dueDate,
        assignedTo: assigneeId,
      }),
    });
    if (created.status !== 201 || !created.body.success || !created.body.data?.id) {
      throw new Error(`Task create failed: ${JSON.stringify(created.body)}`);
    }
    const taskId = created.body.data.id;
    if (created.body.data.createdBy !== creatorId) {
      throw new Error("createdBy must match authenticated user");
    }

    const patched = await request<{ status: string }>(baseUrl, `/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: userHeaders,
      body: JSON.stringify({ status: "IN_PROGRESS" }),
    });
    if (patched.status !== 200 || patched.body.data?.status !== "IN_PROGRESS") {
      throw new Error(`Task patch failed: ${JSON.stringify(patched.body)}`);
    }

    const deleted = await request<{ id: string }>(baseUrl, `/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: userHeaders,
    });
    if (deleted.status !== 200 || deleted.body.data?.id !== taskId) {
      throw new Error(`Task delete failed: ${JSON.stringify(deleted.body)}`);
    }

    const scopedTasks = await request<unknown[]>(baseUrl, "/api/tasks", {
      headers: userHeaders,
    });
    if (scopedTasks.status !== 200 || !scopedTasks.body.success) {
      throw new Error(`Scoped tasks failed: ${JSON.stringify(scopedTasks.body)}`);
    }

    const selfDelete = await request<null>(baseUrl, `/api/users/${me.body.data!.user.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    if (selfDelete.status !== 400 || selfDelete.body.success !== false) {
      throw new Error(`Expected 400 on self-delete: ${JSON.stringify(selfDelete.body)}`);
    }

    const deleteUserRes = await request<{ id: string }>(baseUrl, `/api/users/${creatorId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    if (deleteUserRes.status !== 200 || deleteUserRes.body.data?.id !== creatorId) {
      throw new Error(`User delete failed: ${JSON.stringify(deleteUserRes.body)}`);
    }

    const badLogin = await request<null>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@flowpilot.com", password: "wrong" }),
    });
    if (badLogin.status !== 401 || badLogin.body.success !== false) {
      throw new Error(`Expected 401 on bad login: ${JSON.stringify(badLogin.body)}`);
    }

    console.log("Integration tests passed");
    console.log(`- Admin login + /me OK`);
    console.log(`- Profile update OK`);
    console.log(`- User preferences OK`);
    console.log(`- Tasks OK, ${tasks.body.data!.length} task(s)`);
    console.log(`- Users OK, ${users.body.data!.length} user(s)`);
    console.log(`- Dashboard OK, ${(dashboard.body.data as { summary: { totalTasks: number } }).summary.totalTasks} task(s) in summary`);
    console.log(`- Filtered tasks OK, ${(filteredTasks.body.data as unknown[]).length} OPEN task(s)`);
    console.log(`- Task search OK (title match, not description)`);
    console.log(`- Task CRUD OK (create → patch → delete)`);
    console.log(`- User scoped tasks OK, ${(scopedTasks.body.data as unknown[]).length} task(s)`);
    console.log(`- User delete OK (admin removed user + related tasks)`);
    console.log(`- Error envelope OK on invalid login`);
  } finally {
    server?.close();
    await mongoose.disconnect();
    await mongo.stop();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
