# Proof

A mobile-styled web app that lets you photograph a wine label and uses
Claude's vision to identify the winery, wine name, vintage, grape
varietal(s), region, and country.

This README explains every file in this project and walks through running
it locally and deploying it to Vercel, assuming no prior web development
experience.

## What's in this folder, and why

```
proof/
├── package.json        the project's "ID card" - name, dependencies, scripts
├── vite.config.js       configuration for Vite, the tool that builds the app
├── index.html           the one HTML page the browser actually loads
├── .gitignore           tells Git which files to never upload
├── .env.example         a template showing which secret value the app needs
├── src/
│   ├── main.jsx          the entry point: mounts the app onto the page
│   └── App.jsx           the Proof component itself (your app's UI)
└── api/
    └── analyze.js        a small backend function that talks to Anthropic
```

A modern web app is really two things glued together: a **front end** (what
runs in the visitor's browser - the buttons, the layout, the photo upload)
and, if it needs to keep any secrets or talk to another service, a
**back end** (code that runs on a server, invisible to the visitor). This
project has both.

### `package.json`

Every Node.js project (Node.js is the JavaScript runtime that powers our
build tools) has one of these. It's a plain JSON file that says:

- the project's name and version
- which **scripts** you can run (`npm run dev`, `npm run build`, etc.)
- which **dependencies** (other people's code) the project needs - here,
  `react` and `react-dom` to build the UI, and `vite` plus its React plugin
  to develop and bundle the app

You never edit the dependency version numbers by hand day-to-day; running
`npm install` reads this file and downloads exactly those packages into a
`node_modules` folder (which is why `node_modules` is in `.gitignore` -
it's regenerated from `package.json`, so there's no reason to store it).

### `vite.config.js`

[Vite](https://vitejs.dev) is the build tool used here. In development, it
serves your app instantly and refreshes the browser the moment you save a
file. When you're ready to deploy, it bundles everything (your JSX, your
styles) into a handful of small, optimized files a browser can run. This
config file just tells Vite "this is a React project," via the
`@vitejs/plugin-react` plugin.

### `index.html`

Every website needs at least one HTML file - it's the actual document the
browser opens first. Ours is almost empty on purpose:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

That `<div id="root">` is an empty container. The `<script>` tag loads our
JavaScript, which then finds that container and fills it with the entire
Proof interface. This pattern - one mostly-blank HTML file, with
JavaScript building everything inside it - is how almost all React apps
work; it's called a **single-page app**.

This file also links to Google Fonts (Playfair Display and Inter), which is
why the app's headings and body text have the specific serif/sans-serif
look they do.

### `src/main.jsx`

The very first JavaScript that runs. Its whole job is:

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

In plain English: "find the `root` div from `index.html`, and render the
`App` component into it." Almost every React project has a file like this,
and you'll rarely need to touch it again.

### `src/App.jsx`

This is your actual Proof app - the camera upload button, the
burgundy-and-gold styling, the thumbnail, the data sheet, the pinot noir
easter egg, all of it. It's the same component you were iterating on
before, with one important change explained below.

### `api/analyze.js`

This is the backend half of the app, and it's the piece that makes this
version different from the version you had before.

**The problem it solves:** identifying a wine label requires calling
Anthropic's API, and that call needs a secret API key. If your React code
called Anthropic directly from the browser, that key would be sitting in
plain sight in your app's JavaScript - anyone could open their browser's
developer tools, copy it, and use it on your bill. Browsers also block
this kind of direct request to Anthropic's servers for security reasons
(this is called a CORS restriction).

**The fix:** Vercel treats any file inside an `/api` folder as its own
tiny server endpoint. This file becomes reachable at `/api/analyze` once
deployed. Your React app sends the photo to `/api/analyze`; this function
(which runs on Vercel's servers, never in the visitor's browser) attaches
your real API key and forwards the request to Anthropic, then relays
Anthropic's answer back to the app. The key never leaves the server.

### `.env.example`

A **template** for secret configuration values - in this app, just your
Anthropic API key. You copy this file to a real `.env` file and fill in
your actual key for local development; `.env` itself is listed in
`.gitignore` so you never accidentally publish your key to GitHub. On
Vercel, you'll set the same value through their dashboard instead (details
below) - the `.env` file is only used on your own computer.

### `.gitignore`

Tells Git (the tool that tracks your code's history and is used by
GitHub) which files and folders to always ignore: the enormous
auto-generated `node_modules` folder, the `dist` folder Vite produces when
building for production, and any `.env` file containing secrets.

## Running it on your own computer

You'll need [Node.js](https://nodejs.org) installed (the LTS version is
fine). Then, in a terminal, inside this folder:

1. **Install the dependencies:**
   ```
   npm install
   ```
   This reads `package.json` and downloads React, Vite, etc.

2. **Add your Anthropic API key.** Copy `.env.example` to a new file
   named `.env`, and paste in a real key from
   [console.anthropic.com](https://console.anthropic.com):
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Run the app.** Because this project has both a front end and a
   backend function, use the Vercel CLI's development server, which runs
   both together:
   ```
   npx vercel dev
   ```
   The first time, it will ask you to log in to Vercel and link the
   project - just follow the prompts. It will then print a local address
   (something like `http://localhost:3000`) - open that in your browser.

   (Running `npm run dev` instead would start the app faster, but it only
   runs the front end, so the "Identify" button would fail - it needs
   `/api/analyze` to exist, which only `vercel dev` provides locally.)

## Deploying to Vercel

[Vercel](https://vercel.com) is a hosting service built around exactly
this kind of project - it detects the `/api` folder automatically and
turns each file into a live serverless endpoint, with no server setup on
your part.

1. **Push this project to a GitHub repository.** If you're new to Git:
   ```
   git init
   git add .
   git commit -m "Proof"
   ```
   Then create a new repository on GitHub and follow its instructions to
   push your code there.

2. **Import the project into Vercel.** Go to
   [vercel.com/new](https://vercel.com/new), sign in, and choose "Import"
   next to your GitHub repository. Vercel will detect it's a Vite project
   automatically - you shouldn't need to change any build settings.

3. **Add your API key.** Before (or right after) your first deploy, go to
   your project's **Settings > Environment Variables** in Vercel, and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your real Anthropic API key

   This is the Vercel equivalent of your local `.env` file - it makes the
   key available to `api/analyze.js` once deployed, without it ever being
   written into your code or repository.

4. **Deploy.** Click "Deploy." Vercel builds the app and gives you a live
   URL (something like `proof.vercel.app`) that works on any phone or
   computer.

From then on, every time you push a new commit to GitHub, Vercel
automatically rebuilds and redeploys the site.

## A note on cost and usage

Every time someone uploads a photo and it gets analyzed, `api/analyze.js`
makes one call to the Anthropic API, which is billed to whichever API key
you configured. If you expect real public traffic, it's worth keeping an
eye on your usage in the Anthropic console.
