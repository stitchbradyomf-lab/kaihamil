# _products — Staging Area

Pre-publish research, design docs, and prototypes. Underscore prefix = Netlify ignores this folder.

## Structure

```
_products/
├── groove-pal/
│   ├── design/         # Flows, wireframes, specs
│   ├── research/       # Market research, competitor analysis
│   └── assets/         # Draft images, logos before final
│
├── vale-os/
│   ├── design/
│   ├── research/
│   └── assets/
│
└── [future-product]/
```

## Workflow

1. **Research & Design** → Work happens here in `_products/`
2. **Review** → Kyle reviews on GitHub
3. **Publish** → Move finished content to `products/[name]/` (live path)

## What Goes Where

| Stage | Location |
|-------|----------|
| Ideas, research, rough drafts | `_products/[name]/research/` |
| Flow diagrams, specs, wireframes | `_products/[name]/design/` |
| Draft assets, prototypes | `_products/[name]/assets/` |
| **Final, approved, live** | `products/[name]/` |

---

*This folder exists on GitHub but is not deployed to the website.*
