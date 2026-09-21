# Implementation Plan: Tema II Evidence Package

## Overview

Prepare the Tema II academic evidence package from the existing Astro/React project: verify the application at runtime, capture representative evidence, produce a PDF report following the previous report's institutional style, and deliver a clean project ZIP with the requested nomenclature.

## Scope

- Preserve the existing application behavior and source code.
- Add only deliverable artifacts and temporary generation inputs outside the project runtime source.
- Use runtime evidence for the Tema I baseline and Tema II actuators page.
- Exclude `node_modules/` and generated development caches from the project ZIP; retain source, lockfile, and production build output.

## Task List

### Phase 1: Evidence

- [ ] Verify the previous report style and identify the existing group metadata.
- [ ] Run checks, tests, and production build.
- [ ] Capture desktop views of Tema I, Tema II, interactive states, code, tests, and final sections.

### Checkpoint: Evidence

- [ ] Application loads on both routes.
- [ ] Test and build commands pass.
- [ ] Captures are readable and tied to a report section.

### Phase 2: Deliverables

- [ ] Create the Spanish PDF report with institutional cover, numbered sections, figures, explanations, publication note, and conclusion.
- [ ] Create the project ZIP with the requested filename and a reproducible project structure.

### Checkpoint: Complete

- [ ] PDF opens and has the expected page count and readable text.
- [ ] ZIP integrity passes and contains the expected files without dependencies/cache directories.
- [ ] Final filenames match the requested nomenclature.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| No public hosting URL is available | Medium | State clearly that the project is delivered for local execution and avoid inventing a link. |
| Browser captures expose an incomplete lazy-loaded state | Medium | Wait for the page, scroll through target sections, and capture after the interactive component is visible. |
| Including `node_modules/` makes the ZIP too large | Medium | Package source, lockfile, and `dist/`; document `npm install` as the setup path. |
| Missing identity data for the cover | Medium | Reuse the names and control numbers present in the previous report. |

## Open Questions

- None blocking. The previous report supplies the group identity and no publication URL was found in the project.
