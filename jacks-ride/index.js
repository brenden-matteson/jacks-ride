import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import pg from "pg";

// dirname, app, port
const app = express();
const port = 3000;
// temporary directory name
const __dirname = "http://localhost:3000/";

// db connect
const db = new pg.Client({
    user: "postgres",              // default
    host: "localhost",
    database: "posts",      // database
    password: "password",
    port: 5432,
});

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// global variables
// declare global current user
let user = [];

// logged in boolean (REPLACE WITH NAU CAS VARIFICATION)
let loggedIn = false;

// get home page
app.get("/", async (req, res) => {

    const __pagename = "JacksRide Feed";
    const __path = "/home";

    try {
        res.render("home.ejs", {
            __dirname,
            __pagename,
            __path,
            user,
            loggedIn
        });
    }
    catch (error) 
    {
        console.error("Error loading posts:", error.stack);
        res.status(500).send("Error loading posts");
    }
});

// get home page
app.get("/home", async (req, res) => {

    const __pagename = "JacksRide Feed";
    const __path = req.route.path;

    try {
        res.render("home.ejs", {
            __dirname,
            __pagename,
            __path
        });
    }
    catch (error) 
    {
        console.error("Error loading posts:", error.stack);
        res.status(500).send("Error loading posts");
    }
});

// get search page
app.get("/search", async (req, res) => {

    const __path = req.route.path;

    try {
        res.render("search.ejs", {
            __dirname,
            __path
        });
    }
    catch (error) 
    {
        console.error("Error loading search:", error.stack);
        res.status(500).send("Error loading search");
    }
});

// get new post 
app.get("/add-post", async (req, res) => {

    const __pagename = "Post a";
    const __path = req.route.path;

    try {
        res.render("add-post.ejs", {
            __dirname,
            __pagename,
            __path
        });
    }
    catch (error) 
    {
        console.error("Error loading new post:", error.stack);
        res.status(500).send("Error loading now post");
    }
});

// get notifications page
app.get("/:id/notifications", async (req, res) => {

    const __pagename = "JacksRide Activity";
    const __path = req.route.path;
    const account_id = req.params.id;

    try {
        res.render("notifications.ejs", {
            __dirname,
            __pagename,
            __path
        });
    }
    catch (error) 
    {
        console.error("Error loading notifications:", error.stack);
        res.status(500).send("Error loading notifications");
    }
});

// get settings page
app.get("/:id/settings", async (req, res) => {

    const __path = req.route.path;
    const account_id = req.params.id;

    try {
        res.render("settings.ejs", {
            __dirname,
            __path
        });
    }
    catch (error) 
    {
        console.error("Error loading settings:", error.stack);
        res.status(500).send("Error loading settings");
    }
});

// starting server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});