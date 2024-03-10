"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./utils/server");
const mongoose_1 = __importDefault(require("mongoose"));
const CONNECTION = process.env.MONGODB_URL;
const PORT = process.env.PORT;
if (!CONNECTION || !PORT) {
    throw new Error('MongoDB URL or Port is not defined in the environment variables.');
}
mongoose_1.default.connect(CONNECTION)
    .then(() => server_1.app.listen(PORT, () => console.log(`Database Connected to port: ${PORT}`)))
    .catch((error) => console.error(error));
//# sourceMappingURL=server.js.map