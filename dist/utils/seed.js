import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
const now = new Date();
const addDays = (d) => new Date(now.getTime() + d * 86400000);
const seedUsers = [
    {
        email: "admin@flowpilot.com",
        password: "Admin@123",
        fullName: "Alex Admin",
        role: "ADMIN",
        status: "ACTIVE",
        jobTitle: "Platform Admin",
        department: "Operations",
    },
    {
        email: "user@flowpilot.com",
        password: "User@123",
        fullName: "John User",
        role: "USER",
        status: "ACTIVE",
        jobTitle: "Frontend Engineer",
        department: "Engineering",
    },
    {
        email: "jane@flowpilot.com",
        password: "User@123",
        fullName: "Jane Doe",
        role: "USER",
        status: "ACTIVE",
        jobTitle: "Product Designer",
        department: "Design",
    },
    {
        email: "mark@flowpilot.com",
        password: "User@123",
        fullName: "Mark Lee",
        role: "USER",
        status: "INACTIVE",
        jobTitle: "QA Engineer",
        department: "Engineering",
    },
    {
        email: "sara@flowpilot.com",
        password: "User@123",
        fullName: "Sara Kim",
        role: "USER",
        status: "ACTIVE",
        jobTitle: "Backend Engineer",
        department: "Engineering",
    },
];
async function seed() {
    await connectDb();
    await Task.deleteMany({});
    await User.deleteMany({});
    const userIdByEmail = new Map();
    for (const u of seedUsers) {
        const passwordHash = await bcrypt.hash(u.password, 10);
        const user = await User.create({
            fullName: u.fullName,
            email: u.email,
            passwordHash,
            role: u.role,
            status: u.status,
            jobTitle: u.jobTitle,
            department: u.department,
        });
        userIdByEmail.set(u.email, user._id);
    }
    const id = (email) => {
        const userId = userIdByEmail.get(email);
        if (!userId)
            throw new Error(`Missing seed user: ${email}`);
        return userId;
    };
    const seedTasks = [
        {
            title: "Design new dashboard layout",
            description: "Create wireframes and prototype for the new analytics dashboard.",
            priority: "HIGH",
            status: "IN_PROGRESS",
            dueDate: addDays(3),
            createdBy: id("admin@flowpilot.com"),
            assignedTo: id("jane@flowpilot.com"),
        },
        {
            title: "Fix login redirect bug",
            description: "Users are not redirected after successful login on Safari.",
            priority: "HIGH",
            status: "OPEN",
            dueDate: addDays(1),
            createdBy: id("user@flowpilot.com"),
            assignedTo: id("user@flowpilot.com"),
        },
        {
            title: "Write API documentation",
            description: "Document all REST endpoints for the v2 release.",
            priority: "MEDIUM",
            status: "TESTING",
            dueDate: addDays(5),
            createdBy: id("admin@flowpilot.com"),
            assignedTo: id("sara@flowpilot.com"),
        },
        {
            title: "Refactor task slice",
            description: "Split selectors and async thunks into separate files.",
            priority: "LOW",
            status: "DONE",
            dueDate: addDays(-2),
            createdBy: id("user@flowpilot.com"),
            assignedTo: id("user@flowpilot.com"),
        },
        {
            title: "Onboard new team members",
            description: "Prepare onboarding doc and schedule intro calls.",
            priority: "MEDIUM",
            status: "OPEN",
            dueDate: addDays(7),
            createdBy: id("admin@flowpilot.com"),
            assignedTo: id("admin@flowpilot.com"),
        },
        {
            title: "Kanban drag-and-drop polish",
            description: "Improve animations and reduce jitter while reordering cards.",
            priority: "MEDIUM",
            status: "IN_PROGRESS",
            dueDate: addDays(4),
            createdBy: id("jane@flowpilot.com"),
            assignedTo: id("user@flowpilot.com"),
        },
        {
            title: "Overdue: send Q2 report",
            description: "Compile and send the quarterly metrics report.",
            priority: "HIGH",
            status: "OPEN",
            dueDate: addDays(-3),
            createdBy: id("admin@flowpilot.com"),
            assignedTo: id("sara@flowpilot.com"),
        },
        {
            title: "User profile page polish",
            description: "Improve responsive layout and avatar upload UX.",
            priority: "LOW",
            status: "TESTING",
            dueDate: addDays(6),
            createdBy: id("jane@flowpilot.com"),
            assignedTo: id("jane@flowpilot.com"),
        },
    ];
    await Task.insertMany(seedTasks);
    console.log(`Seeded ${seedUsers.length} users and ${seedTasks.length} tasks`);
    await mongoose.disconnect();
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map