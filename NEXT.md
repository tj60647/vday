# Next

Updated: 2026-11-22

## Where it stands

A Valentine card and love-letter writing assistant, exported from Google AI Studio as a React page with a small Express server (`server.ts`) that calls Gemini, so the key stays on the server. It was made on 2026-09-10 in three commits and not touched since. The site at https://vday-aroughidea.vercel.app asks for Vercel's own sign-in before it shows anything, and whether its server routes run there has not been checked.

## Next step

Open the site signed in to Vercel and write one letter. If the request fails, the Express server is not running on Vercel: move its route into a Vercel function under `api/`, or decide the demo stays local.

## After that

- Add a README: what the assistant does, how to run it (`npm run dev`), and the `GEMINI_API_KEY` it needs.
- Rename the package from `react-example`.

## Blocked or waiting

- None.

## Open questions

- Should the site be open to anyone, or stay behind Vercel's sign-in?
- Is this a class demo still in use, or finished?
- This plan was drafted by Claude on 2026-11-22 from the code and its history. Is the next step right?
