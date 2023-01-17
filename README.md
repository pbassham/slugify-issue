# Slugify Github Issue and update Cloudflare KV

This action creates slugs for Github Issues and updates the key-value store in Cloudflare KV when any issue is edited.

Useful for using Github issues as a CMS of sorts and need to fetch the content by the slug rather than the issue number.

## Environment Variables

### `CLOUDFLARE_ACCOUNT_ID`

**Required** The Cloudflare Account that hosts the KV worker.

### `CLOUDFLARE_API_KEY`

**Required** The Cloudflare API Key.

## Inputs

### `namespace_identifier`

**Required** The Cloudflare namespace of the KV worker.

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

## Customizing

If you are going to clone this and modify it, there are a few things to note.

1. Run `npm run publish` before committing to Github to be run as an action. This is what compiles the .ts files and creates the `/dist` and `/lib` directories with .js files able to be run as a Github Action.
2. commit all changed files and push to remote, including the `node_modules`
3. This can be automated with Husky / git hooks probably, but its not done yet

### Resources

- [Github Typescript Action Starter](https://github.com/actions/typescript-action)

- [Github GraphQL Docs](https://docs.github.com/en/graphql/reference/interfaces)

- [Cloudflare KV Docs](https://developers.cloudflare.com/api/operations/workers-kv-namespace-read-the-metadata-for-a-key)
