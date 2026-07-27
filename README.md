# My Portfolio

A 3D interactive portfolio website built with modern web technologies.

## Tech Stack

- Next.js 16
- React 19
- React-three-fiber / DREI
- GSAP
- Zustand
- TailwindCSS 4
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization Checklist

Replace the following placeholders with your own content:

- [ ] **Name & Bio**: Update `app/layout.tsx` (search for "Your Name Here")
- [ ] **Hero Text**: Update `app/components/hero/index.tsx` ("Hi, I am Your Name.")
- [ ] **Taglines**: Update `app/components/hero/TextWindow.tsx`
- [ ] **Social Links**: Update `app/constants/footer.ts` (LinkedIn, GitHub, etc.)
- [ ] **Projects**: Update `app/constants/projects.ts` with your own projects
- [ ] **Work Timeline**: Update `app/constants/work.ts` with your education/experience
- [ ] **Resume**: Add your resume PDF to `public/` and update the path in `app/constants/footer.ts`
- [ ] **OpenGraph Image**: Add your own `app/opengraph-image.png`
- [ ] **Favicon**: Replace `app/favicon.ico` and `public/favicon-*.png`

## Deployment

This project deploys to GitHub Pages via the included GitHub Actions workflow (`.github/workflows/nextjs.yml`).

To set up:
1. Push this repo to your GitHub
2. Enable GitHub Pages in your repo settings (source: GitHub Actions)
3. Optionally set `GH_PAGES_CUSTOM_DOMAIN` secret for a custom domain
4. Optionally set `NEXT_PUBLIC_GA_ID` secret for Google Analytics

## License

Based on a template by [mohitvirli](https://github.com/mohitvirli).
