import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import rides from "./rides.js";

// dirname, app, port
const app = express();
const port = 3000;
// temporary directory name
const __dirname = "http://localhost:3000/";
/* dirname for non-local hosting
const __dirname = dirname(fileURLToPath(import.meta.url));
*/

// db connect
const db = new pg.Client({
    user: "postgres",              // default
    host: "localhost",
    database: "posts",      // database
    password: "password",
    port: 5432,
});

/* database connection point
db.connect()
    .then(() => console.log("Connected to Postgres"))
    .catch((err) => console.error("DB connection error:", err.stack));
*/

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// global variables
// current user
let user = [];

// logged in boolean (REPLACE WITH NAU CAS VARIFICATION)
let loggedIn = true;

// get home page
app.get("/", async (req, res) => {

    const __pagename = "JacksRide Feed";
    const __path = "/home";

    try {
        // verification check
        if (!loggedIn) {
            return res.redirect("/auth");
        }

        res.redirect("/home")
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
    let filter_tab = req._parsedOriginalUrl.query;

    if (filter_tab != "all" && filter_tab != "requests" && filter_tab != "offers") {
        filter_tab = "all";
    }

    let filtered_rides = rides;

    if(filter_tab == "requests") {
        filtered_rides = rides.filter(ride => ride.ride_type == "Request");
        console.log(filtered_rides);
    }
    if(filter_tab == "offers") {
        filtered_rides = rides.filter(ride => ride.ride_type == "Offer");
        console.log(filtered_rides);
    }

    try {
        res.render("home.ejs", {
            __dirname,
            __pagename,
            __path,
            filter_tab,
            filtered_rides
        });
    }
    catch (error) 
    {
        console.error("Error loading posts:", error.stack);
        res.status(500).send("Error loading posts");
    }
});

app.get("/:id/ride", async (req, res) => {

    const __pagename = "JacksRide Feed";
    const __path = req.route.path;
    const ride_id = req.params.id;

    try {
        res.render("home.ejs", {
            __dirname,
            __pagename,
            __path,
            filter_tab
        });
    }
    catch (error) 
    {
        console.error("Error loading post:", error.stack);
        res.status(500).send("Error loading post");
    }
});

// get search page
app.get("/search", async (req, res) => {

    const __pagename = "Search";
    const __path = req.route.path;

    try {
        res.render("search.ejs", {
            __dirname,
            __pagename,
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