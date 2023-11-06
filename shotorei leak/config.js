"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBHOOKS = exports.URL_SNIPER_SELF_TOKEN = exports.SNIPER_SELF_TOKEN = exports.SNIPER_GUILD_ID = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.SNIPER_GUILD_ID = "sunucu idsi"; // ايدي سيرفر الي تبي تصيد فيه اختصارات
exports.SNIPER_SELF_TOKEN = "listener token"; // توكن الحساب الي داخل سيرفرات
exports.URL_SNIPER_SELF_TOKEN = "sniper token"; // توكن الحساب الي معو رتبة في سيرفر صيد
exports.WEBHOOKS = {
    SUCCESS: async (content) => {
        await (0, node_fetch_1.default)(`webhook 1`, { // لوق صيد
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                content,
            }),
        });
    },
    FAIL: async (content) => {
        await (0, node_fetch_1.default)(`webhook 2`, { // لوق الاخطاء
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content,
            }),
        });
    },
};

