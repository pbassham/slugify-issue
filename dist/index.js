import './sourcemap-register.cjs';/******/ var __webpack_modules__ = ({

/***/ 554:
/***/ ((__webpack_module__, __unused_webpack___webpack_exports__, __nccwpck_require__) => {

__nccwpck_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {

var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const cloudflare_js_1 = __importDefault(require("./cloudflare.js"));
// import fetch from "node-fetch"
try {
    // This should be triggerd with the issue, so will have that payload
    const { action, issue, changes } = github_1.default.context.payload;
    // Cloudflare
    // const account = core.getInput("cloudflare_account_id")
    // const namespace = core.getInput("cloudflare_namespace_id")
    // const namespace = core.getInput("namespace_identifier")
    const slug = slugify(issue === null || issue === void 0 ? void 0 : issue.title);
    console.log(`Title: ${issue.title} => Slug: ${slug}`);
    // console.log(`Slug: ${slug}!`)
    // let updateKey = true
    let keyExists = undefined;
    let valuesMatch = undefined;
    let result = undefined;
    const checkKey = await (0, cloudflare_js_1.default)({ key: slug });
    // console.log(checkKey, typeof checkKey, typeof issue.number)
    if (typeof checkKey === "number") {
        result = checkKey;
        keyExists = true;
        valuesMatch = checkKey == issue.number;
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
        await deleteSlug(slug);
    }
    else if (keyExists && valuesMatch) {
        console.log(`No update needed for key: ${result} -> ${issue.number}`);
        // return //`Done`
    }
    else if (keyExists && !valuesMatch) {
        console.log(`Key '${result}' exists, but needs updating to ${issue.number}`);
        await updateSlug(slug, issue.number);
    }
    else if (!keyExists) {
        console.log(`Key '${slug}' doesnt exist. `);
        await updateSlug(slug, issue.number);
    }
    if (action === "edited") {
        const oldSlug = slugify((_a = changes === null || changes === void 0 ? void 0 : changes.title) === null || _a === void 0 ? void 0 : _a.from);
        if (oldSlug && slug !== oldSlug) {
            console.log(`Old Slug to delete: "${oldSlug}". (New Slug: "${slug}")`);
            // console.log(`Need to delete old slug: ${oldSlug}`)
            await deleteSlug(oldSlug);
        }
    }
    // await revalidate(slug)
    core_1.default.setOutput("slug", slug);
    core_1.default.setOutput("issue_number", issue.number);
    // core.setOutput("needsUpdate", updateKey)
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github_1.default.context.payload, undefined, 2);
    console.log(`\nThe event payload: ${payload}`);
}
catch (error) {
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github_1.default.context.payload, undefined, 2);
    console.log(`\nThe event payload: ${payload}`);
    core_1.default.setFailed(error.message);
}
// }
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
async function updateSlug(key, value) {
    // console.log(`Updating Key: "${key}" to Value "${value}"`)
    const res = await (0, cloudflare_js_1.default)({ key, value });
    if (!res.success) {
        console.log(res);
        core_1.default.error(res.errors);
        throw res;
    }
    return res;
}
// async function addSlug(key, value) {
//   return await kv({ key, value })
// }
async function deleteSlug(slug) {
    // console.log(`Deleting Slug: ${slug}`)
    const res = await (0, cloudflare_js_1.default)({ key: slug, DELETE: true });
    if (!res.success) {
        console.log(res);
        core_1.default.error(res.errors);
        throw res;
    }
    return res;
}
// async function revalidate(slug) {
//   const REVALIDATE_TOKEN = core.getInput("revalidate_token")
//   console.log(`Revalidating link: ${slug}`)
//   const res = await fetch(`https://www.philbassham.com/api/revalidate?secret${REVALIDATE_TOKEN}&slug=${slug}`)
//   if (!res.ok) throw res
//   const json = await res.json()
//   return json
// }

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && !queue.d) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = 1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __nccwpck_require__(554);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 

//# sourceMappingURL=index.js.map