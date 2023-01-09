const core = require("@actions/core")
const github = require("@actions/github")

// TODO: set up conditions for other trigger actions
try {
  // This should be triggerd with the issue, so will have that payload
  const { action, issue, changes } = github.context.payload
  // const account = core.getInput("cloudflare_account_id")
  // const namespace = core.getInput("cloudflare_namespace_id")
  // const token = core.getInput("cloudflare_token")
  const slug = slugify(issue?.title)
  console.log(`Title: ${issue.title}!`)
  console.log(`Slug: ${slug}!`)
  const updateKey = true

  if (action === "edited") {
    const oldSlug = changes?.title?.from
    if (oldSlug && slug !== slugify(oldSlug)) {
      updateKey = false
      console.log(`Dont need to update slug.`)
    }
  }

  core.setOutput("slug", slug)
  core.setOutput("issue_number", issue.number)
  core.setOutput("needsUpdate", updateKey)

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
