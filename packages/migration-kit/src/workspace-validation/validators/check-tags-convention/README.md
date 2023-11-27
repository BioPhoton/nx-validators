# Check Tags Convention
![check-tags-convention.png](../../../../docs/images/check-tags-convention.png)

## Description
The goal of this validator is to ensure projects tags are defined and correctly following the convention so we can validate project boundaries.

## Solutions
The `project.json` file should contain a `tags` property with the following tags convention:

- `type:<type>` where `<type>` can be one of the project type defined [here](../check-project-convention/README.md).
- `scope:<scope>`

Here is a correct example:

```json
{
  "tags": ["scope:shared", "type:app"]
}
```
