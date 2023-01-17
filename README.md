# Slugify Github Issue and update Cloudflare KV

This action creates slugs for Github Issues and updates the key-value store in Cloudflare KV when any issue is edited.

Useful for using Github issues as a CMS of sorts and need to fetch the content by the slug rather than the issue number.

It was bootstrapped with "[Creating a JavaScript action](https://help.github.com/en/articles/creating-a-javascript-action)" in the GitHub Help documentation.

<!-- ## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`. -->

## Outputs

### `slug`

The slugified version of the issue title.

### `issue_number`

The GitHub Issue number

## Example usage

```yaml
on:
  issues:
    types: [opened, edited]

jobs:
  update-cloudflare-slug:
    runs-on: ubuntu-latest
    steps:
      - name: Update Cloudflare Slug
        uses: pbassham/slugify-issue@main # Uses an action in the root directory
        id: update-slug
        env:
          CLOUDFLARE_API_KEY: ${{ secrets.CLOUDFLARE_TOKEN }}
          # CLOUDFLARE_ACCOUNT_EMAIL: ${{ secrets.CLOUDFLARE_ACCOUNT_EMAIL }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        with:
          namespace_identifier: ${{secrets.CLOUDFLARE_NAMESPACE_ID}}
```

You can then use the value in a multi-step Action like this:

```yaml
# This is not related, but shows how you can use the outputs in another action
name: Update Cloudflare KV values for issue slugs

on:
  issues:
    types: [opened, edited, deleted]

jobs:
  update-cloudflare-slug:
    runs-on: ubuntu-latest
    steps:
      - name: Update Cloudflare Slug
        uses: pbassham/slugify-issue@main # Uses an action in the root directory
        id: update-slug
        env:
          CLOUDFLARE_API_KEY: ${{ secrets.CLOUDFLARE_TOKEN }}
          # CLOUDFLARE_ACCOUNT_EMAIL: ${{ secrets.CLOUDFLARE_ACCOUNT_EMAIL }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        with:
          namespace_identifier: ${{secrets.CLOUDFLARE_NAMESPACE_ID}}
      - name: Show Outputs
        run: echo "Outputs issue_number '${{ steps.update-slug.outputs.issue_number }}' Slug '${{ steps.update-slug.outputs.slug }}'"
      - name: Revalidate Next.js link (via curl / on-demand revalidation)
        run: |
          curl -X GET "https://www.example.com/api/revalidate?secret=${{secrets.REVALIDATE_TOKEN}}&slug=${{steps.update-slug.outputs.slug}}"
```
## To Publish
1. Edit
2. Run `npm run publish`
3. commit all changed files and push to remote