"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const core_1 = __importDefault(require("@actions/core"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const API_VERSION = "v4";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiKey = process.env.CLOUDFLARE_API_KEY;
const accountEmail = process.env.CLOUDFLARE_ACCOUNT_EMAIL;
const namespaceId = core_1.default.getInput("namespace_identifier");
const headers = accountEmail
    ? {
        "X-Auth-Key": apiKey,
        "X-Auth-Email": accountEmail,
    }
    : {
        Authorization: `Bearer ${apiKey}`,
    };
// const key = core.getInput("key_name")
// const value = core.getInput("value")
// const expirationTtl = core.getInput("expiration_ttl")
// const expiration = core.getInput("expiration")
async function set(key, value, expiration, expirationTtl) {
    let url = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
    headers["Content-Type"] = "text/plain";
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
        headers,
    });
    if (response.ok)
        console.log(`...SET SUCCESSFULLY: ${key} : ${value}`);
    const data = await response.text();
    return JSON.parse(data);
}
async function get(key) {
    const kvUrl = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
    const response = await (0, node_fetch_1.default)(kvUrl, {
        headers,
        responseType: "json",
        responseEncoding: "utf8",
    });
    const data = await response.text();
    if (response.ok)
        console.log(`...FETCHED SUCCESSFULLY: ${key}: ${data}`);
    return JSON.parse(data);
}
async function del(key) {
    const kvUrl = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
    const response = await (0, node_fetch_1.default)(kvUrl, {
        headers,
        method: "DELETE",
        responseType: "json",
        responseEncoding: "utf8",
    });
    if (response.ok)
        console.log(`...DELETED SUCCESSFULLY: ${key}`);
    const data = await response.text();
    return JSON.parse(data);
}
async function kv({ key, value, expiration, expirationTtl, DELETE }) {
    //   console.log(`kv key: ${key} value:${value}`)
    if (DELETE === true) {
        core_1.default.info(`DELETING value for Key: "${key}"`);
        return del(key);
    }
    else if (value
    // && (value.length > 0 || Object.keys(value).length > 0)
    ) {
        core_1.default.info(`SETTING value for "${key}" to "${value}"`);
        return set(key, value, expirationTtl);
    }
    else {
        core_1.default.info(`FETCHING value for Key: "${key}"`);
        return get(key);
    }
}
exports.default = kv;
