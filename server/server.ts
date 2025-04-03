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
      <h1>Edit Page</h1>
      <form method="POST" action="/api/projects/add">
        <label>Title: <input name="title" /></label><br/>
        <label>Description: <input name="description" /></label><br/>
        <button type="submit">Add Project</button>
      </form>
      <p><a href="/">Back to Portfolio</a></p>
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
  


