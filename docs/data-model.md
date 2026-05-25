# Data Model

The canonical schema is defined in:

- [schema/resource.schema.json](../schema/resource.schema.json)

## Common Resource Fields

- `id`
- `name`
- `slug`
- `type`
- `city`
- `state`
- `country`
- `website`
- `categories`
- `tags`
- `access_level`
- `verified`
- `description`

## Data Quality Expectations

- every entry is source-backed
- valid URL and meaningful metadata
- stable slug and category taxonomy
- no placeholders or synthetic filler text
