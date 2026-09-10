# Portfolio project instructions

- Read README.md and Docs/PROJECT_STATUS.md before changes.
- This repository owns the personal website. XUILab is an independent source project; never modify that repository as part of website maintenance.
- Keep Astro static output, TypeScript, and plain CSS. Avoid adding client frameworks, analytics, backends, or data collection without a concrete user request.
- Maintain both zh and en for every public page. Preserve corresponding-page language switching and system-default theme behavior.
- Public identity lives in src/data/profile.ts. Do not extract names, resumes, email, employment claims, or other private information from local reference files.
- XUILab facts and media must come from its public Showcase/release. Pin source links to an explicit tag. Preserve measured conditions, inconclusive results, quality_limited, historical source identity, and agent contribution attribution.
- Videos are frame-driven demonstrations, not real-time performance footage. Keep native controls, no autoplay, no initial video preload, and accessible adjacent descriptions.
- Run npm run verify after relevant changes. Browser visual or playback testing is a separate activity; never claim it based only on build/static or mocked-script checks.
- Keep Docs/PROJECT_STATUS.md accurate about what was actually validated and deployed. Do not publish secrets, raw machine logs, PM materials, or private research inputs.
- Use GitHub Pages as requested by the owner. Pushes to main publish automatically; pull requests only validate.
