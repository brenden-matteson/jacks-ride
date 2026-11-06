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

// get home page
app.get("/", async (req, res) => {

    try {
        res.render("home.ejs", {
            __dirname
        });
    }
    catch (error) 
    {
        console.error("Error loading posts:", error.stack);
        res.status(500).send("Error loading posts");
    }
});

// starting server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});