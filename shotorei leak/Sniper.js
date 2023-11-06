"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clc = require('cli-color');
const node_fetch_1 = __importDefault(require("node-fetch"));
const ws_1 = __importDefault(require("ws"));
const config_1 = require("./config");
const guilds_1 = Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {};

console.clear();
var setTitle = require('console-title');
setTitle('Vanity Sniper V8 || Created by DKOF || DK Store || Discord.gg/D5');
class Sniper {
    constructor() {
        this.opcodes = {
            DISPATCH: 0,
            HEARTBEAT: 1,
            IDENTIFY: 2,
            RECONNECT: 7,
            HELLO: 10,
            HEARTBEAT_ACK: 11,
        };
        this.interval = null;
        this.createPayload = (data) => JSON.stringify(data);
        this.heartbeat = () => {
            return this.socket.send(this.createPayload({
                op: 1,
                d: {},
                s: null,
                t: "heartbeat",
            }));
        };
        this.socket = new ws_1.default("wss://gateway.discord.gg/?v=10&encoding=json");
        this.socket.on("open", () => {
            console.log(clc.yellow(`Created By DKOF | DK Store`))
            console.log(clc.red(`To buy please enter Discord : https://discord.gg/D5\n`))

           

            this.socket.on("message", async (message) => {
                const data = JSON.parse(message);
                if (data.op === this.opcodes.DISPATCH) {
                    if (data.t === "GUILD_UPDATE") {
                        const find = guilds_1.default[data.d.guild_id];
                        if (typeof find?.vanity_url_code === 'string' && find.vanity_url_code !== data.d.vanity_url_code) {
                            (0, node_fetch_1.default)(`https://discord.com/api/v10/guilds/${config_1.SNIPER_GUILD_ID}/vanity-url`, {
                                method: "PATCH",
                                body: this.createPayload({
                                    code: find.vanity_url_code,
                                }),
                                headers: {
                                    Authorization: config_1.URL_SNIPER_SELF_TOKEN,
                                    "Content-Type": "application/json",
                                },
                            }).then(async (res) => {
                                if (res.ok) {
                                    console.log(clc.green(`Sniper Done Vanity : [${find.vanity_url_code}]`))
                                    await config_1.WEBHOOKS.SUCCESS(`**Vanity Successfully Claimed \n Vanity : ${find.vanity_url_code} \n URL : https://discord.gg/${find.vanity_url_code} \n\n||@everyone||.**`);
                                }
                                else {
                                    const error = await res.json();
                                    await config_1.WEBHOOKS.FAIL(`**Error Claimed Vanity : \`${find.vanity_url_code}\`**.
\`\`\`JSON
${JSON.stringify(error, null, 4)}
\`\`\`
`);
                                }
                                delete guilds_1.default[data.d.guild_id];
                            }).catch(err => {
                                console.log(err);
                                return delete guilds_1.default[data.d.guild_id];
                            });
                        }
                    }
                    else {
                        if (data.t === "READY") {
                            data.d.guilds
                                .filter((e) => typeof e.vanity_url_code === "string")
                                .forEach((e) => (guilds_1.default[e.id] = { vanity_url_code: e.vanity_url_code, name: e.name}));

                               console.log(clc.red(Object.entries(guilds_1.default).map(([key, value]) => {return `Server Vanity : [${clc.blue.bold([value.vanity_url_code]) }]\n`;}).join("")))
                                
                        }
                        else if (data.t === "GUILD_CREATE") {
                            guilds_1.default[data.d.id] = { vanity_url_code: data.d.vanity_url_code };
                        }
                        else if (data.t === "GUILD_DELETE") {
                            const find = guilds_1.default[data.d.id];
                            setTimeout(() => {
                                if (typeof find?.vanity_url_code === "string") {
                                    (0, node_fetch_1.default)(`https://discord.com/api/v10/guilds/${config_1.SNIPER_GUILD_ID}/vanity-url`, {
                                        method: "PATCH",
                                        body: this.createPayload({
                                            code: find.vanity_url_code,
                                        }),
                                        headers: {
                                            Authorization: config_1.URL_SNIPER_SELF_TOKEN,
                                            "Content-Type": "application/json",
                                        },
                                    }).then(async (res) => {
                                        if (res.ok) {
                                            console.log(clc.green(`Sniper Done Vanity : [${find.vanity_url_code}]`))
                                            await config_1.WEBHOOKS.SUCCESS(`**Vanity Successfully Claimed \n Vanity : ${find.vanity_url_code} \n URL : https://discord.gg/${find.vanity_url_code} \n\n||@everyone||.**`);
                                        }
                                        else {
                                            const error = await res.json();
                                            await config_1.WEBHOOKS.FAIL(`**Error Claimed Vanity : \`${find.vanity_url_code}\`**.
\`\`\`JSON
${JSON.stringify(error, null, 4)}
\`\`\`
`);
                                        }
                                        delete guilds_1.default[data.d.guild_id];
                                    }).catch(err => {
                                        console.log(err);
                                        return delete guilds_1.default[data.d.guild_id];
                                    });
                                }
                            }, 25);
                        }
                    }
                }
                else if (data.op === this.opcodes.RECONNECT)
                    return process.exit();
                else if (data.op === this.opcodes.HELLO) {
                    clearInterval(this.interval);
                    this.interval = setInterval(() => this.heartbeat(), data.d.heartbeat_interval);
                    this.socket.send(this.createPayload({
                        op: this.opcodes.IDENTIFY,
                        d: {
                            token: config_1.SNIPER_SELF_TOKEN,
                            intents: 1,
                            properties: {
                                os: "macos",
                                browser: "Safari",
                                device: "MacBook Air",
                            },
                        },
                    }));
                }
            });
            this.socket.on("close", (reason) => {
                console.log('Websocket connection closed by discord', reason);
                return process.exit();
            });
            this.socket.on("error", (error) => {
                console.log(error);
                process.exit();
            });
        });
    }
}
exports.default = Sniper;
