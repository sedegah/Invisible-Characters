# Invisible Characters

A powerful web application for detecting invisible Unicode characters and comparing code with intelligent language detection.

## Features

### Unicode Scanner
Detect and remove invisible and suspicious Unicode characters from text including:
- Zero-width spaces and joiners
- Bidirectional control characters 
- Non-breaking spaces
- Format control characters
- Byte order marks
- Over 50 invisible character types

### Code Comparator
Advanced code comparison tool with:
- AI-powered language detection
- Side-by-side diff visualization
- Line-by-line change tracking
- Syntax-aware comparison
- Export comparison results
- Comparison history

### DOCX Processor
Process Microsoft Word documents to:
- Extract and analyze text content
- Detect invisible characters in documents
- Preserve formatting while cleaning text
- Export cleaned documents

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI
- Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm 9 or higher

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

### Production

```bash
pnpm start
```

## Project Structure

```
app/
├── page.tsx                      # Landing page
├── unicode-scanner/              # Unicode detection tool
├── code-comparator/              # Code comparison tool
└── docs/                         # Documentation

components/
├── PortfolioNavbar.tsx           # Navigation
├── ProductTeaserCard.tsx         # Feature showcase
├── FAQSection.tsx                # FAQ component
└── Footer.tsx                    # Site footer

lib/
├── unicode-engine.ts             # Unicode detection engine
├── code-comparison-engine.tsx    # Code comparison logic
├── docx-processor.ts             # Document processing
└── utils.ts                      # Utility functions
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Configuration

### Next.js
See [next.config.mjs](next.config.mjs) for Next.js configuration including:
- Image optimization with AVIF and WebP support
- Package import optimizations
- Server actions configuration
- Turbopack bundler settings

### Vercel
See [vercel.json](vercel.json) for deployment configuration including:
- Security headers
- Cache control policies
- Build settings

## Performance

The application is optimized for performance with:
- Turbopack bundler for faster builds
- Image optimization with next-gen formats
- Package import optimization for tree-shaking
- React Server Components
- Static generation where possible

## Security

Security headers are configured including:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Content Security Policy
- Referrer Policy

## License

MIT

## Author

sedegah
