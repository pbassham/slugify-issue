# Slugify Github Issue

This action returns a slugified version of a Github Issue.

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

### `needs_update`

Whether or not the KV Store (like Cloudflare KV store) needs to be updated with the new slug.

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
        with:
          # cloudflare_account_id: ${{secrets.CLOUDFLARE_ACCOUNT_ID}}
          # cloudflare_namespace_id: ${{secrets.CLOUDFLARE_NAMESPACE_ID}}
          # cloudflare_token: ${{secrets.CLOUDFLARE_TOKEN}}
      # Show the output
      - name: Print outputs
        run: echo "Outputs issue_number is ${{ steps.update-slug.outputs.issue_number }} and title is ${{ steps.update-slug.outputs.slug }}. Need to update KV Store? ${{ steps.update-slug.outputs.needs_update }}"
```

You can then use the value in another step like this:

```yaml
# This is not related, but shows how you can use the outputs in another action
- name: cloudflare-kv-action
  uses: zentered/cloudflare-kv-action@v1.0.0
  id: cloudflare_kv
  env:
    CLOUDFLARE_API_KEY: ${{ secrets.CLOUDFLARE_TOKEN }}
    # CLOUDFLARE_ACCOUNT_EMAIL: ${{ secrets.CLOUDFLARE_ACCOUNT_EMAIL }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
  with:
    namespace_identifier: ${{secrets.CLOUDFLARE_NAMESPACE_ID}}
    key_name: ${{ steps.update-slug.outputs.slug }}
    value: ${{ steps.update-slug.outputs.issue_number }}
    expiration_ttl: 120
```
