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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
//@ts-nocheck
// import core from "@actions/core"
const github = __importStar(require("@actions/github"));
const cloudflare_1 = require("./cloudflare");
// import fetch from "node-fetch"
async function run() {
    var _a;
    try {
        // This should be triggerd with the issue, so will have that payload
        const { action, issue, changes } = github.context.payload;
        // Cloudflare
        if (!issue)
            throw `No Issue input`;
        // const account = core.getInput("cloudflare_account_id")
        // const namespace = core.getInput("cloudflare_namespace_id")
        // const namespace = core.getInput("namespace_identifier")
        const slug = slugify(issue === null || issue === void 0 ? void 0 : issue.title);
        if (!slug)
            throw `Slug not defined: ${slug}`;
        console.log(`Title: ${issue.title} => Slug: ${slug}`);
        // console.log(`Slug: ${slug}!`)
        // let updateKey = true
        let keyExists = undefined;
        let valuesMatch = undefined;
        let result = undefined;
        // const checkKey = await kv({ key: slug })
        const checkKey = await (0, cloudflare_1.get)({ key: slug });
        // console.log(checkKey, typeof checkKey, typeof issue.number)
        if (typeof checkKey === "string") {
            result = checkKey;
            keyExists = true;
            valuesMatch = checkKey == issue.number.toString();
        }
        else if (typeof checkKey === "object") {
            result = checkKey.result;
            keyExists = checkKey.result !== null;
            valuesMatch = checkKey.result == issue.number;
        }
        // console.log(result, keyExists, valuesMatch)
        // console.log(`Value of ${slug}: ${checkKey.result}`)
        // if (!checkKey.success) {
        //   console.log(checkKey)
        //   core.notice(checkKey.errors)
        // }
        if (action === "deleted" && keyExists) {
            await (0, cloudflare_1.del)({ key: slug });
        }
        else if (keyExists && valuesMatch) {
            console.log(`No update needed for key: ${result} -> ${issue.number}`);
            // return //`Done`
        }
        else if (keyExists && !valuesMatch) {
            console.log(`Key '${result}' exists, but needs updating to ${issue.number}`);
            await (0, cloudflare_1.set)({ key: slug, value: issue.number });
        }
        else if (!keyExists) {
            console.log(`Key '${slug}' doesnt exist. `);
            await (0, cloudflare_1.set)({ key: slug, value: issue.number });
            // await updateSlug(slug, issue.number)
        }
        if (action === "edited") {
            const oldSlug = slugify((_a = changes === null || changes === void 0 ? void 0 : changes.title) === null || _a === void 0 ? void 0 : _a.from);
            if (oldSlug && slug !== oldSlug) {
                console.log(`Old Slug to delete: "${oldSlug}". (New Slug: "${slug}")`);
                // console.log(`Need to delete old slug: ${oldSlug}`)
                await (0, cloudflare_1.del)({ key: oldSlug });
            }
        }
        // await revalidate(slug)
        core.setOutput("slug", slug);
        core.setOutput("issue_number", issue.number);
        // core.setOutput("needsUpdate", updateKey)
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2);
        core.startGroup(`The Event Payload`);
        core.info(`\nThe event payload: ${payload}`);
        core.endGroup();
    }
    catch (error) {
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2);
        core.startGroup(`The Event Payload`);
        core.info(`\nThe event payload: ${payload}`);
        core.endGroup();
        // console.error(`\nThe event payload: ${payload}`)
        //@ts-expect-error
        core.setFailed(error === null || error === void 0 ? void 0 : error.message);
    }
}
run();
function slugify(text) {
    // console.log(text);
    // console.log(typeof text);
    if (!text || typeof text !== "string")
        return null;
    return (text
        // .toString() // Cast to string (optional)
        .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase() // Convert the string to lowercase letters
        .trim() // Remove whitespace from both sides of a string (optional)
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-")); // Replace multiple - with single -
}
// async function updateSlug(key, value) {
//   // console.log(`Updating Key: "${key}" to Value "${value}"`)
//   const res = await kv({ key, value })
//   if (!res.success) {
//     console.log(res)
//     core.error(res.errors)
//     throw res
//   }
//   return res
// }
// // async function addSlug(key, value) {
// //   return await kv({ key, value })
// // }
// async function deleteSlug(slug) {
//   // console.log(`Deleting Slug: ${slug}`)
//   const res = await kv({ key: slug, DELETE: true })
//   if (!res.success) {
//     console.log(res)
//     core.error(res.errors)
//     throw res
//   }
//   return res
// }
// async function revalidate(slug) {
//   const REVALIDATE_TOKEN = core.getInput("revalidate_token")
//   console.log(`Revalidating link: ${slug}`)
//   const res = await fetch(`https://www.philbassham.com/api/revalidate?secret${REVALIDATE_TOKEN}&slug=${slug}`)
//   if (!res.ok) throw res
//   const json = await res.json()
//   return json
// }
