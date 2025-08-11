# ResumeCV (React Native)

A mobile app to build resumes/CVs quickly with AI assistance and manual template-based export to PDF.

## Features

- __AI assistance (current)__
  - Uses `services/ai.ts` with Gemini to enhance individual sections:
    - Bullet points generation
    - Text rewording
    - Summary improvement
- __Manual flow (current)__
  - Fill fields in the editor, preview resume in `app/resume/preview.tsx`
  - Export to PDF via `services/pdf.ts`
- __Templates (current/planned)__
  - `app/resume/templates.tsx` lists available templates and preview logic
  - Goal: offer 5 free HTML templates and export selected template to PDF
- __Roadmap (planned)__
  - Refactor AI flow: user provides basic info → AI generates 3 complete CV variants → user selects preferred design

## Tech Overview

- TypeScript throughout
- Key modules:
  - `types/resume.ts` — core `Resume` type (fullName, email, phone, summary, experience[], education[], skills[])
  - `services/ai.ts` — Gemini-powered helpers for section-level enhancements
  - `services/resume.ts` — helpers to map/build resume data for templates
  - `services/pdf.ts` — HTML → PDF export logic
  - `app/resume/templates.tsx` — template selection and previews
  - `app/resume/preview.tsx` — live resume preview screen

## Getting Started

1) __Requirements__
- Node.js LTS
- Xcode (for iOS Simulator)
- CocoaPods (for iOS): `sudo gem install cocoapods`

2) __Install dependencies__

```bash
npm install
# or
yarn
```

3) __iOS setup__

```bash
npx pod-install ios
```

4) __Run on iOS Simulator__ (preferred)

```bash
npx react-native run-ios
```

If you open Xcode, you can also run the workspace from `ios/` and choose a Simulator.

5) __Run on Android__ (optional)

```bash
npx react-native run-android
```

## Environment Variables

Create a `.env` file in the project root for the Gemini API key used in `services/ai.ts`.

```
GEMINI_API_KEY=your_api_key_here
```

Ensure your key is kept private and not committed to version control.

## Usage

- Open the app on the Simulator.
- Fill in resume fields (name, contact, summary, experience, education, skills).
- Use AI enhancements (where available) to improve bullet points or summaries.
- Choose a template in `Templates` (when enabled) and preview in `Preview`.
- Export to PDF via the export action (handled by `services/pdf.ts`).

## Project Structure (selected)

```
/ResumeCV
├─ app/
│  └─ resume/
│     ├─ templates.tsx
│     └─ preview.tsx
├─ services/
│  ├─ ai.ts
│  ├─ pdf.ts
│  └─ resume.ts
├─ types/
│  └─ resume.ts
└─ README.md
```

## Development Notes

- Keep `types/resume.ts` in sync with any form/editor changes.
- When adding templates, centralize registration in `app/resume/templates.tsx` and ensure compatibility with `services/pdf.ts`.
- For AI changes, extend `services/ai.ts` with clear function boundaries (input: `Resume` fields, output: transformed text/bullets) and handle API errors gracefully.

## Roadmap

- Generate 3 complete AI CV designs from minimal user input and present a selection screen.
- Finish the manual template selection screen with 5 free HTML templates.
- Improve PDF rendering fidelity and add per-template styling guides.

## Troubleshooting

- iOS build issues: run `npx pod-install ios`, then clean build in Xcode if needed.
- Dotenv not loading: confirm `.env` exists and is loaded by your config. Do not commit real keys.
- PDF render inconsistencies: verify template HTML/CSS is supported by the PDF engine used in `services/pdf.ts`.

## Data Model

The core types live in `types/resume.ts`. Key shapes:

```ts
export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface LinkItem {
  id: string;
  label: string; // e.g., LinkedIn, GitHub, Portfolio
  url: string;
}

export interface PhoneItem {
  id: string;
  dial: string; // e.g., +1
  number: string; // local number part
  countryCode?: string; // e.g., US
  label?: string; // e.g., Mobile, Work
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  kind?: 'manual' | 'ai';
  fullName: string;
  email: string;
  phone?: string; // legacy single phone
  website?: string;
  linkedIn?: string;
  github?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  links?: LinkItem[];
  phones?: PhoneItem[];
  template?: string; // selected HTML template ID
  temp?: boolean; // using pre-built template flag
  aiHtml?: string; // when kind==='ai'
  aiPrompt?: string;
  aiModel?: string; // e.g., gemini-2.0-flash-lite
  aiTemplateName?: string;
  createdAt: Date;
  updatedAt: Date;
}

```

Related:

- `CoverLetter` for optional cover letter drafts
- `AIAction` and `AIResponse` to track AI operations

## Architecture & Workflows

- __Manual flow__
  1. User fills resume fields in the editor.
  2. Preview in `app/resume/preview.tsx`.
  3. Select a free template in `app/resume/templates.tsx`.
  4. Export to PDF via `services/pdf.ts`.

- __AI-assisted flow (current)__
  - Section-level helpers in `services/ai.ts` (generate bullet points, reword text, improve summary).

- __AI full-generation flow (planned)__
  - User provides minimal info → Gemini generates 3 complete CV variants (content + layout hints) → user selects one. Saved as `kind: 'ai'` with `aiHtml` and metadata.

## Templates

- Free plan aims to offer 5 HTML-based templates.
- `app/resume/templates.tsx` acts as the registry and preview UI.
- To add a template:
  1. Implement a renderer that accepts `Resume` and returns HTML/CSS suitable for PDF.
  2. Register the template ID/label/preview in `templates.tsx`.
  3. Ensure `services/pdf.ts` supports the template’s CSS (avoid unsupported features).

## Scripts

Common scripts and commands:

```bash
# install deps
npm install

# iOS pods
npx pod-install ios

# run on iOS Simulator (preferred)
npx react-native run-ios

# run on Android
npx react-native run-android

# start Metro bundler (if needed)
npx react-native start
```

## PDF Export

- Implemented in `services/pdf.ts`.
- Converts template HTML to a PDF file that can be shared/exported.
- Tips:
  - Prefer simple, print-friendly CSS.
  - Test on multiple Simulators for layout consistency.

## Privacy & Security

- Store sensitive keys in `.env` (see GEMINI_API_KEY).
- Avoid committing real user data or API keys.
- When using AI features, surface a notice that text may be sent to a third-party API (Gemini).

## FAQ

- __Why isn’t my PDF styled correctly?__ Some CSS features are not supported by the PDF engine. Simplify styles and avoid complex layout techniques.
- __Where do I add new fields?__ Update `types/resume.ts` and the corresponding editor form, then adjust templates as needed.
- __Can I run on a physical device?__ Yes, but this project prioritizes the iOS Simulator for a free developer account setup.

## Contributing

- Keep types and UI in sync.
- Add templates with consistent data access patterns.
- Include clear error handling for AI/network operations.

## License

MIT
