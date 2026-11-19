import "dotenv/config";
import { createApiApp } from "../src/server/apiApp.js";

const app = createApiApp();

export default function handler(req: any, res: any) {
  return app(req, res);
}
