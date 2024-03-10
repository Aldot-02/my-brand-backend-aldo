"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_1 = __importDefault(require("../utils/swagger"));
// IMPORTING ROUTES
const AuthRoute_1 = __importDefault(require("../Routes/AuthRoute"));
const UserRoute_1 = __importDefault(require("../Routes/UserRoute"));
const BlogsRoute_1 = __importDefault(require("../Routes/BlogsRoute"));
exports.app = (0, express_1.default)();
(0, swagger_1.default)(exports.app, 3000);
// MIDDLEWARES
exports.app.use((0, cors_1.default)({
    credentials: true,
    origin: ['https://my-brand-backend-aldo-1.onrender.com', 'http://127.0.0.1:5500', 'https://aldot.netlify.app']
}));
exports.app.use(body_parser_1.default.json({ limit: '30mb' }));
exports.app.use(body_parser_1.default.urlencoded({ limit: '30mb', extended: true }));
exports.app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
exports.app.use('/auth', AuthRoute_1.default);
exports.app.use('/user', UserRoute_1.default);
exports.app.use('/blog', BlogsRoute_1.default);
exports.app.get("/", (req, res) => {
    res.send("Consider using the above link for getting my APIs");
});
//# sourceMappingURL=server.js.map