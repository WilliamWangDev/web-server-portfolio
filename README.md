# Web-Server-Portfolio

### Clone this repo

```bash
git clone https://github.com/WilliamWangDev/web-server-portfolio.git

cd web-server-portfolio
```

### Install backend dependencies

```bash
cd server
npm install
```

### Compile Frontend TypeScript

From the **project root** (i.e., `web-server-portfolio/`)

```bash
tsc --project tsconfig.frontend.json
```

if you come across an error like:

```bash
node_modules/@types/node/http.d.ts:1955:32 - error TS2792: Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?

1955     const MessageEvent: import("undici-types").MessageEvent;
                                    ~~~~~~~~~~~~~~


Found 19 errors in 2 files.

Errors  Files
    16  node_modules/@types/node/globals.d.ts:6
     3  node_modules/@types/node/http.d.ts:1947
```

You can fix it by running from your project folder (e.g., `web-server-portfolio/` or s`erver/`):

```bash
npm install --save-dev undici-types
```

Then run:

```bash
tsc
```
**Continue with the next step.**

### Run the App Locally

From the `/server` directory:

```bash
cd server
npx ts-node server.ts
```

### Then open your browser at:

```bash
http://localhost:3000/index.html
```

## TODO

- **Load Balancing with HAProxy**:

  Install and configure HAProxy to distribute traffic between at least two Nginx instances.

- **Report**

- **Video**
