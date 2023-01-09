const core = require("@actions/core")
const github = require("@actions/github")

// run()
// async function run() {
try {
  // `who-to-greet` input defined in action metadata file
  // const nameToGreet = core.getInput("who-to-greet")
  // const issue_title = core.getInput("issue_title")

  // This should be triggerd with the issue, so will have that payload
  const { issue } = github.context.payload
  // const account = core.getInput("cloudflare_account_id")
  // const namespace = core.getInput("cloudflare_namespace_id")
  // const token = core.getInput("cloudflare_token")
  // console.log(`Hello ${nameToGreet}!`)
  // console.log(`Title: ${issue_title}!`)
  const slug = slugify(issue?.title)

  console.log(`Title: ${issue.title}!`)
  console.log(`Slug: ${slug}!`)

  // const res = await updateKey(slug, issue.number, account, namespace, token)

  // console.log(res)
  // const time = new Date().toTimeString()

  // core.setOutput("time", time)
  core.setOutput("slug", slug)
  core.setOutput("issue_number", issue.number)

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`)
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

// async function updateKey(key, value, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_NAMESPACE_ID, CLOUDFLARE_TOKEN) {
//   const headers = {
//     Authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
//     "Content-Type": "application/json",
//   }
//   const { success, result, errors } = await fetch(
//     `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_NAMESPACE_ID}/values/${key}`,
//     {
//       method: "PUT",
//       headers,
//       body: value,
//     }
//   ).then((response) => response.json())

//   console.log(success)
//   console.log(result)
//   console.log(errors)
//   // ...
// }
