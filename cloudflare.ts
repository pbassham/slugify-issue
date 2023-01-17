import * as core from "@actions/core"
// @ts-nocheck
// import type { Response, ResponseInit } from "@cloudflare/workers-types"
// import core from "@actions/core"
import fetch from "node-fetch"

const API_VERSION = "v4"
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
const apiKey = process.env.CLOUDFLARE_API_KEY
// const accountEmail = process.env.CLOUDFLARE_ACCOUNT_EMAIL

const namespaceId = core.getInput("namespace_identifier")
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
export async function set({
  key,
  value,
  expiration,
  expirationTtl,
}: {
  key: string
  value: string | number
  expiration?: number
  expirationTtl?: number
}): Promise<CFResponse> {
  core.info(`SETTING value for "${key}" to "${value}"`)
  let url = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`

  // headers["Content-Type"] = "text/plain"

  if (expiration) {
    url = `${url}?expiration=${expiration}`
  } else if (expirationTtl) {
    url = `${url}?expiration_ttl=${expirationTtl}`
  }

  if (typeof value !== "string") {
    if (Object.keys(value).length > 0) {
      value = JSON.stringify(value)
    } else {
      value = value.toString()
    }
  }

  const response = await fetch(url, {
    method: "PUT",
    body: value,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  })
  if (response.ok) console.log(`...SET SUCCESSFULLY: ${key} : ${value}`)

  const data = await response.text()
  const json: CFResponse = JSON.parse(data)
  return json
}

export async function get({ key }: { key: string }): Promise<CFResponse | string> {
  core.info(`FETCHING value for Key: "${key}"`)
  const kvUrl = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`
  const response = await fetch(kvUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    // responseType: "json",
    // responseEncoding: "utf8",
  })
  const data = await response.text()
  if (response.ok) {
    console.log(`...FETCHED SUCCESSFULLY: ${key}: ${data}`)
    return data
  } else {
    const json: CFResponse = JSON.parse(data)
    return json
  }
}
export async function del({ key }: { key: string }): Promise<CFResponse> {
  core.info(`DELETING value for Key: "${key}"`)
  const kvUrl = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`
  const response = await fetch(kvUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
    // responseType: "json",
    // responseEncoding: "utf8",
  })
  if (response.ok) console.log(`...DELETED SUCCESSFULLY: ${key}`)
  const data = await response.text()
  const json: CFResponse = JSON.parse(data)
  return json
  // return JSON.parse(data)
}

// export async function kv({ key, value, expiration, expirationTtl, DELETE }) {
//   //   console.log(`kv key: ${key} value:${value}`)
//   if (DELETE === true) {
//     core.info(`DELETING value for Key: "${key}"`)
//     return del(key)
//   } else if (
//     value
//     // && (value.length > 0 || Object.keys(value).length > 0)
//   ) {
//     core.info(`SETTING value for "${key}" to "${value}"`)
//     return set(key, value, expirationTtl)
//   } else {
//     core.info(`FETCHING value for Key: "${key}"`)
//     return get(key)
//   }
// }

// export default kv

type CFResponse = {
  errors: CFMessage[]
  messages: CFMessage[]
  result: {}
  success: boolean
}

type CFMessage = {
  code: number
  message: string
}
