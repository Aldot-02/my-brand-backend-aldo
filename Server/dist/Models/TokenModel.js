"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
    },
    token: {
        type: String,
    },
    expired_at: {
        type: String,
    },
}, {
    timestamps: true
});
const TokenModel = mongoose_1.default.model("Tokens", tokenSchema);
exports.default = TokenModel;
//# sourceMappingURL=TokenModel.js.map