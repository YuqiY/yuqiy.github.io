# Yuqi Yang — Academic website

The permanent local working copy is `/Users/yuqiyang/Documents/personal-website`.

An unpublished local website built with Sites, using Ning Ma, Harish Guda, and Lina Wang’s academic websites as design references. Nothing has been registered, uploaded, synchronized, or deployed.

## Preview

Open `dist/index.html` in a browser. All three pages and the CV PDF work directly from the downloaded folder. Alternatively, serve `dist` with a local HTTP server:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

No external fonts, JavaScript libraries, tracking, or remote images are required.

## Pages

- `dist/index.html`: biography, contact, education, professional service, and applied experience.
- `dist/research.html`: research interests and methods, working papers, work in progress, and presentations.
- `dist/teaching.html`: instructor and teaching-assistant experience, evaluations, and courses prepared to teach.
- `dist/styles.css`: shared styling, mobile layout, and print styles.
- `dist/assets/Yuqi-Yang-CV.pdf`: current two-page CV download.

## Content and references

Biographical and academic content comes from `cv-academic.tex` and `myinfo.tex` in the job-market project, read on September 22, 2026. That project was used read-only. Paper titles, author order, statuses, and teaching evaluations follow the CV. “Reject and Resubmit” is preserved exactly; no acceptance, honors, portraits, or profile URLs have been inferred.

The CV PDF was compiled from separate temporary copies of the current source. Only missing LaTeX macro declarations were added to the temporary style file for compilation; no CV content was changed. The original files in the job-market project remain unchanged.

Design references:

- https://www.ningma7.com/
- https://harishguda.me/about/
- https://www.linawang.me/

The redesign uses conventional About/Research/Teaching/CV navigation, restrained serif text, compact paper citations, burgundy links, and a contact block. None of the reference academics’ biographies, photographs, or research has been reused.

The local `.openai/hosting.json` identifies the static directory only. No hosted project ID exists. Do not publish unless requested.

## Project maintenance

Use this folder as the main working copy and add it as a local project in the desktop app. Local Git history is initialized; no remote repository or publishing workflow is configured. See `AGENTS.md` for preserved instructions and `PROJECT_NOTES.md` for improvements to discuss.
