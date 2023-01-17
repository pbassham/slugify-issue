"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.get = exports.set = void 0;
const core = __importStar(require("@actions/core"));
// @ts-nocheck
// import type { Response, ResponseInit } from "@cloudflare/workers-types"
// import core from "@actions/core"
const node_fetch_1 = __importDefault(require("node-fetch"));
const API_VERSION = "v4";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiKey = process.env.CLOUDFLARE_API_KEY;
// const accountEmail = process.env.CLOUDFLARE_ACCOUNT_EMAIL
const namespaceId = core.getInput("namespace_identifier");
// const headers = {Authorization: `Bearer ${apiKey}`}
// accountEmail
//   ? {
//       "X-Auth-Key": apiKey,
//       "X-Auth-Email": accountEmail,
//     }
//   : {
//       Authorization: `Bearer ${apiKey}`,
//     }
// const key = core.getInput("key_name")
// const value = core.getInput("value")
// const expirationTtl = core.getInput("expiration_ttl")
// const expiration = core.getInput("expiration")
async function set({ key, value, expiration, expirationTtl, }) {
    core.info(`SETTING value for "${key}" to "${value}"`);
    let url = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
    // headers["Content-Type"] = "text/plain"
    if (expiration) {
        url = `${url}?expiration=${expiration}`;
    }
    else if (expirationTtl) {
        url = `${url}?expiration_ttl=${expirationTtl}`;
    }
    if (typeof value !== "string") {
        if (Object.keys(value).length > 0) {
            value = JSON.stringify(value);
        }
        else {
            value = value.toString();
        }
    }
    const response = await (0, node_fetch_1.default)(url, {
        method: "PUT",
        body: value,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
    });
    if (response.ok)
        console.log(`...SET SUCCESSFULLY: ${key} : ${value}`);
    const data = await response.text();
    const json = JSON.parse(data);
    return json;
}
exports.set = set;
async function get({ key }) {
    core.info(`FETCHING value for Key: "${key}"`);
    const kvUrl = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
    const response = await (0, node_fetch_1.default)(kvUrl, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        // responseType: "json",
        // responseEncoding: "utf8",
    });
    const data = await response.text();
    if (response.ok) {
        console.log(`...FETCHED SUCCESSFULLY: ${key}: ${data}`);
        return data;
    }
    else {
        const json = JSON.parse(data);
        return json;
    }
}
exports.get = get;
async function del({ key }) {
    core.info(`DELETING value for Key: "${key}"`);
    const kvUrl = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
    const response = await (0, node_fetch_1.default)(kvUrl, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        method: "DELETE",
        // responseType: "json",
        // responseEncoding: "utf8",
    });
    if (response.ok)
        console.log(`...DELETED SUCCESSFULLY: ${key}`);
    const data = await response.text();
    const json = JSON.parse(data);
    return json;
    // return JSON.parse(data)
}
exports.del = del;
