# Heartenza Services

Multi-service website for travel, driver, home, vehicle, delivery, companion,
medical-assistance, and occasion support in Wayanad.

## Project structure

```text
.
|-- index.html                         # Public homepage URL
|-- services.html                      # Public services directory URL
|-- tours.html                         # Public tour listing URL
|-- tour-details.html                  # Dynamic tour detail URL (?tour=place)
|-- about.html / contact.html          # Public company pages
|-- *-services.html / *-maintenance.html
|                                      # Permanent individual service URLs
|-- src/
|   |-- styles/                        # Shared and page-specific CSS
|   |-- scripts/                       # Page behavior and interactions
|   `-- data/                          # Structured tour content
|-- public/
|   `-- assets/
|       |-- images/                    # Local raster images
|       `-- icons/                     # SVG icon sprites and favicon
|-- vite.config.js                     # Multi-page Vite build configuration
`-- package.json
```

HTML entry files intentionally remain in the project root. This preserves the
existing permanent URLs used by visitors and search engines.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

The production build is written to `dist/`.
