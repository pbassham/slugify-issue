import core from "@actions/core"
import github from "@actions/github"
import kv from "./cloudflare.js"
// import fetch from "node-fetch"

try {
  // This should be triggerd with the issue, so will have that payload
  const { action, issue, changes } = github.context.payload
  // Cloudflare

  // const account = core.getInput("cloudflare_account_id")
  // const namespace = core.getInput("cloudflare_namespace_id")
  // const namespace = core.getInput("namespace_identifier")
  const slug = slugify(issue?.title)
  console.log(`Title: ${issue.title} => Slug: ${slug}`)
  // console.log(`Slug: ${slug}!`)

  // let updateKey = true

  const checkKey = await kv({ key: slug })
  // console.log(`Value of ${slug}: ${checkKey.result}`)
  // if (!checkKey.success) {
  //   console.log(checkKey)
  //   core.notice(checkKey.errors)
  // }
  const keyExists = checkKey.result !== null
  const valuesMatch = checkKey.result == issue.number

  if (action === "deleted" && keyExists) {
    await deleteSlug(slug)
  } else if (keyExists && valuesMatch) {
    console.log(`No update needed for key: ${checkKey.result} -> ${issue.number}`)
    // return //`Done`
  } else if (keyExists && !valuesMatch) {
    console.log(`Key '${checkKey.result}' exists, but needs updating to ${issue.number}`)
    await updateSlug(slug, issue.number)
  } else if (!keyExists) {
    console.log(`Key '${slug}' doesnt exist. `)
    await updateSlug(slug, issue.number)
  }
  if (action === "edited") {
    const oldSlug = slugify(changes?.title?.from)
    if (oldSlug && slug !== oldSlug) {
      console.log(`Old Slug to delete: "${oldSlug}". (New Slug: "${slug}")`)
      // console.log(`Need to delete old slug: ${oldSlug}`)
      await deleteSlug(oldSlug)
    }
  }

  // await revalidate(slug)
  core.setOutput("slug", slug)
  core.setOutput("issue_number", issue.number)
  // core.setOutput("needsUpdate", updateKey)

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`\nThe event payload: ${payload}`)
} catch (error) {
  core.setFailed(error.message)
}
// }

function slugify(text) {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
}

async function updateSlug(key, value) {
  // console.log(`Updating Key: "${key}" to Value "${value}"`)
  const res = await kv({ key, value })
  if (!res.success) {
    console.log(res)
    core.error(res.errors)
    throw res
  }
  return res
}
// async function addSlug(key, value) {
//   return await kv({ key, value })
// }
async function deleteSlug(slug) {
  // console.log(`Deleting Slug: ${slug}`)
  const res = await kv({ key: slug, DELETE: true })
  if (!res.success) {
    console.log(res)
    core.error(res.errors)
    throw res
  }
  return res
}

// async function revalidate(slug) {
//   const REVALIDATE_TOKEN = core.getInput("revalidate_token")
//   console.log(`Revalidating link: ${slug}`)
//   const res = await fetch(`https://www.philbassham.com/api/revalidate?secret${REVALIDATE_TOKEN}&slug=${slug}`)
//   if (!res.ok) throw res
//   const json = await res.json()
//   return json
// }
