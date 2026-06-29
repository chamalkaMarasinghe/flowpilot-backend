import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
async function main() {
    await connectDb();
    const app = createApp();
    app.listen(env.PORT, () => {
        console.log(`API listening on http://localhost:${env.PORT}`);
    });
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map