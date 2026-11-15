import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
// import rides from "./rides.js";

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
    host: "172.21.160.1",
    database: "jacksride",      // database
    password: "supergoodpassword",
    port: 5432,
});

// database connection point
db.connect()
    .then(() => console.log("Connected to Postgres"))
    .catch((err) => console.error("DB connection error:", err.stack));

// middleware
app.use(express.static("public"));

// global variables
// current user (DUMMY)
let user = [
    {
        creator_id: 1,
        user_id: "bmm598",
        name: "Brenden Matteson",
    }
];

// logged in boolean (REPLACE WITH NAU CAS VARIFICATION)
let loggedIn = true;

// query helpers
async function getRides(filter) {
    // query to get all info from table
    let query = `
        SELECT
            r.ride_id,
            r.title,
            r.body,
            r.ride_type,
            TO_CHAR(r.ride_date, 'MM-DD-YYYY') AS ride_date,
            r.one_way_two_way,
            r.pets,
            r.payment_amount,
            r.payment_type,
            TO_CHAR(r.departure_time, 'HH12:MI AM') AS departure_time,
            r.seats_available,
            r.destination,
            r.creator_user_id,
            TO_CHAR(r.date_created, 'MM-DD-YYYY') AS date_created,
            u.name AS creator_name,
            u.user_id AS creator_username
        FROM rides r
        LEFT JOIN users u ON r.creator_user_id = u.creator_id
    `;

    // helper filters for filtering query results
    const params = [];
    const conditions = [];

    // filter 
    if (filter && filter.trim() !== "" && filter.trim() !== "all") {
        params.push(`%${filter.toLowerCase()}%`);
        const idx = params.length;
        console.log(idx);
        conditions.push(
            `(LOWER(r.ride_type) LIKE $${idx})`
        );
    }

    // add filters
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    // order by date descending
    query += " ORDER BY r.date_created DESC";

    // execute the query
    const result = await db.query(query, params);

    // return the result
    return result.rows;
}

let rides = await getRides("");

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
    const filter = req._parsedOriginalUrl.query || "";

    try {
        const filtered_rides = await getRides(
            filter
        )

        res.render("home.ejs", {
            __dirname,
            __pagename,
            __path,
            filter_tab: filter,
            filtered_rides,
            user: user[0]
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

app.post("/add-post", async (req, res) => {
    const creatorUserId = user[0].creator_id;
    const creatorName   = user[0].name;

    /* const {
        title,
        content,
        ingredients,
        instructions,
        tags,
        diet,
        cook_time,
        difficulty,
        img
    } = req.body;
     */

    console.log(req.body);
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