# awesomer

Convert any awesome-list into JSON data.

# Run

Requirements:

- npm >= v5

You can configure the following options:

| name           | description                                                     | default                              |
| -------------- | --------------------------------------------------------------- | ------------------------------------ |
| GITHUB_API_KEY | The API key obtained by Github (**required**)                   | `""`                                 |
| LIST_URL       | The URL of the awesome list (should return text) (**required**) | `""`                                 |
| DEST           | The filename for the static JSON file                           | `data.json`                          |
| IMAGE_DEST     | The folder where you want to save the screenshots               | `false` (don't save the screenshots) |

Either passing them as command-line arguments or exporting them as environment variables or even write them to a `config.json` file like the following one:

```JSON
{
  "GITHUB_API_KEY": "asnd29n30r2fmnoGREG%§gr3094wfenoi3",
  "LIST_URL": "https://raw.githubusercontent.com/wbkd/awesome-d3/master/README.md",
  "DEST": "static/data/projects.json",
  "IMAGE_DEST": "static/images/"
}
```

Then you can run:

```
npx github:wbkd/awesomer
```
