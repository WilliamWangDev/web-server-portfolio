import express, { Request, Response } from "express";
import path from "path";
import { OAuth2Client } from "google-auth-library";

interface Project {
    title: string;
    description: string;
  }
  
  const projectData: Project[] = [
    {
      title: "Example Project",
      description: "This is a sample project loaded initially.",
    },
  ];
  

const CLIENT_ID = "130190227451-55t8tghnfgjcohd2drt06hvsrjgiidcp.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);


const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (our frontend). 
app.use(express.static(path.join(__dirname, "..")));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/auth/login", (req: Request, res: Response) => {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
  
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
    });
  
    // Redirect the user to the Google login URL
    res.redirect(url);
  });

  app.get("/auth/callback", async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;
  
    if (!code) {
      res.status(400).send("No code provided.");
      return;
    }
  
    try {
      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      res.redirect("/edit");
    } catch (error) {
      console.error(error);
      res.status(500).send("Authentication failed.");
    }
  });
  

  function ensureAuthenticated(req: Request, res: Response, next: Function) {
   
    if (oauth2Client.credentials && oauth2Client.credentials.access_token) {
      return next();
    } else {
      res.redirect("/auth/login");
    }
  }
  
//   // The "Edit" route to demonstrate protected content
//   app.get("/edit", ensureAuthenticated, (req: Request, res: Response) => {
   
//     res.send(`
//       <h1>Edit Page</h1>
//       <p>You're authenticated! You can edit your portfolio now.</p>
//     `);
//   });
  
  

  app.get("/api/projects", (req: Request, res: Response) => {
    res.json(projectData);
  });
  

  app.get("/edit", ensureAuthenticated, (req: Request, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Edit Projects</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            background-color: #FAFAFA;
            color: #202124;
            padding: 2rem;
          }
          h1 {
            color: #4285F4;
          }
          form {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 500px;
          }
          label {
            display: block;
            margin-top: 1rem;
            font-weight: bold;
          }
          input {
            width: 100%;
            padding: 0.5rem;
            margin-top: 0.25rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          button {
            margin-top: 1.5rem;
            padding: 0.75rem 1.5rem;
            background-color: #4285F4;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
          }
          button:hover {
            background-color: #3367D6;
          }
          a {
            display: inline-block;
            margin-top: 1rem;
            text-decoration: none;
            color: #4285F4;
          }
        </style>
      </head>
      <body>
        <h1>Edit Projects</h1>
        <form method="POST" action="/api/projects/add">
          <label for="title">Project Title</label>
          <input id="title" name="title" type="text" required />
  
          <label for="description">Description</label>
          <input id="description" name="description" type="text" required />
  
          <button type="submit">Add Project</button>
        </form>
        <a href="/index.html">← Back to Portfolio</a>
      </body>
      </html>
    `);
  });
  
  
  app.use(express.urlencoded({ extended: true }));

  app.post("/api/projects/add", ensureAuthenticated, (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (title && description) {
      projectData.push({ title, description });
    }
    res.redirect("/edit");
  });
  


