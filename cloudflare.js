import core from "@actions/core"
import fetch from "node-fetch"

const API_VERSION = "v4"
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
const apiKey = process.env.CLOUDFLARE_API_KEY
const accountEmail = process.env.CLOUDFLARE_ACCOUNT_EMAIL

const namespaceId = core.getInput("namespace_identifier")
// const key = core.getInput("key_name")
// const value = core.getInput("value")
// const expirationTtl = core.getInput("expiration_ttl")
// const expiration = core.getInput("expiration")
async function set(kvUrl, headers, value, expiration, expirationTtl) {
  let url = kvUrl

  headers["Content-Type"] = "text/plain"

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

  await fetch(url, {
    method: "PUT",
    body: value,
    headers,
  })

  return null
}

async function get(kvUrl, headers) {
  const response = await fetch(kvUrl, {
    headers,
    responseType: "json",
    responseEncoding: "utf8",
  })
  const data = await response.text()
  const json = JSON.parse(data)
  return json
}
async function del(kvUrl, headers) {
  const response = await fetch(kvUrl, {
    headers,
    method: "DELETE",
    responseType: "json",
    responseEncoding: "utf8",
  })
  const data = await response.text()
  const json = JSON.parse(data)
  return json
}

export default async function kv({
  //   accountId,
  //   accountEmail,
  //   apiKey,
  //   namespaceId,
  key,
  value,
  expiration,
  expirationTtl,
  DELETE,
  //
}) {
  const kvUrl = `https://api.cloudflare.com/client/${API_VERSION}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`

  const headers = accountEmail
    ? {
        "X-Auth-Key": apiKey,
        "X-Auth-Email": accountEmail,
      }
    : {
        Authorization: `Bearer ${apiKey}`,
      }
  console.log(`kv key: ${key} value:${value}`)
  if (DELETE === true) {
    core.info(`DELETING value for ${key}`)
    return del(kvUrl, headers, value, expirationTtl)
  } else if (value 
    // && (value.length > 0 || Object.keys(value).length > 0)
    ) {
    core.info(`Setting value for ${key}`)
    return set(kvUrl, headers, value, expirationTtl)
  } else {
    core.info(`Getting value for ${key}`)
    return get(kvUrl, headers)
  }
}
// var r=34
// console.log(r,r.length)