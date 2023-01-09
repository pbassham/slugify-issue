const core = require("@actions/core")
const github = require("@actions/github")

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet")
  const account = core.getInput("cloudflare_account_id")
  const namespace = core.getInput("cloudflare_namespace_id")
  const token = core.getInput("cloudflare_token")
  const issue_title = core.getInput("issue_title")
  console.log(`Hello ${nameToGreet}!`)

  const time = new Date().toTimeString()
  core.setOutput("time", time)
  core.setOutput("slug", slugify(issue_title))
  core.setOutput("issue_id", "1")

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`)
} catch (error) {
  core.setFailed(error.message)
}

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
