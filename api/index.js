import { createApp } from "../src/app.js";
import { connectDb } from "../src/config/db.js";
let app;
export default async function handler(req, res) {
    if (!app) {
        await connectDb();
        app = createApp();
    }
    return app(req, res);
}
//# sourceMappingURL=index.js.map