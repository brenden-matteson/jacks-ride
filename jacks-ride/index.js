import express from "express";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { toTitleCase } from "./helper.js";
// UNCOMMENT THIS IF NOT USING DATABASE
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

//COMMENT THIS OUT IF NOT USING DATABASE
// database connection point
db.connect()
    .then(() => console.log("Connected to Postgres"))
    .catch((err) => console.error("DB connection error:", err.stack));

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// global variables
// current user (DUMMY)
let user = [
    {
        creator_id: 1,
        user_id: "bmm598",
        name: "Brenden Matteson",
        vehicle_make: "Toyota",
        vehicle_model: "Camry",
        vehicle_year: 2016,
        vehicle_color: "White",
    }
];

// logged in boolean (REPLACE WITH NAU CAS VARIFICATION)
let loggedIn = true;
let user_creator_id = 1;

// user gathered from db instead of DUMMY user, will have to comment this out for server to run
// let user = await getUser(user_creator_id);

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
            r.creator_id,
            TO_CHAR(r.date_created, 'MM-DD-YYYY') AS date_created,
            u.name AS creator_name,
            u.user_id AS creator_username
        FROM rides r
        LEFT JOIN users u ON r.creator_id = u.creator_id
    `;

    // helper filters for filtering query results
    const params = [];
    const conditions = [];

    // filter 
    if (filter && filter.trim() !== "" && filter.trim() !== "all") {
        params.push(`%${filter.toLowerCase()}%`);
        const idx = params.length;
        conditions.push(
            `(LOWER(r.ride_type) LIKE $${idx})`
        );
    }

    // add filters
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    // order by date descending
    query += " ORDER BY r.ride_date ASC";

    // execute the query
    const result = await db.query(query, params);

    // return the result
    return result.rows;
}

async function getUser(id) {
    let query = `
        SELECT * FROM users WHERE creator_id = ${id}
    `;

    const result = await db.query(query);

    return result.rows;
}

async function getConversations(id) {
    let query = `
        SELECT * FROM conversations WHERE rider_id = ${id} OR driver_id = ${id}
    `;

    const result = await db.query(query);

    return result.rows;
}

// get home page
app.get("/", async (req, res) => {
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
            user: user[0]
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
            __path,
            user: user[0]
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

    const __pagename = "Post a Ride or Request";
    const __path = req.route.path;

    try {
        res.render("add-post.ejs", {
            __dirname,
            __pagename,
            __path,
            user: user[0]
        });
    }
    catch (error) 
    {
        console.error("Error loading new post:", error.stack);
        res.status(500).send("Error loading now post");
    }
});

app.post("/add-post", async (req, res) => {
    const creatorId = user[0].creator_id;

    const {
        ride_type,
        vehicle,
        destination_location,
        depature_date,
        depature_time,
        post_title,
        trip_details,
        amount_requested,
        payment1,
        payment2,
        payment3,
        payment4,
        payment5,
        payment6,
        seats_available,
        trip_type,
        pets_allowed,
    } = req.body;

    const payment_types = [payment1, payment2, payment3, payment4, payment5, payment6];
    const payments = payment_types.filter(payment => payment != undefined);
    let vehicle_details = [];
    if (vehicle)
    {
        vehicle_details = vehicle.split(",");
    }

    try {
        await db.query(
            `
            INSERT INTO rides
                (title, body, ride_type, ride_date, one_way_two_way,
                    pets, payment_amount, payment_type, departure_time,
                    seats_available, destination, vehicle_color,
                    vehicle_year, vehicle_make, vehicle_model,
                    creator_id)
            VALUES
                ($1,   $2,   $3,  $4,          $5,
                    $6,  $7,   $8,    $9,
                    $10, $11, $12,
                    $13, $14, $15,
                    $16)
            `,
            [
                post_title,
                trip_details,
                toTitleCase(ride_type),
                depature_date,
                trip_type,
                pets_allowed,
                amount_requested,
                payments.toLocaleString(),
                depature_time,
                seats_available || null,
                destination_location,
                vehicle_details[0] || null,
                vehicle_details[1] || null,
                vehicle_details[2] || null,
                vehicle_details[3] || null,
                creatorId
            ]
        );

        res.redirect("/");
    } catch (error) {
        console.error("Error inserting post:", error.stack);
        res.status(500).send("Error creating post");
    }
});

// get notifications page
app.get("/notifications", async (req, res) => {

    const __pagename = "JacksRide Activity";
    const __path = req.route.path;

    // DUMMY notifications response
    const notifications = [
        {
            status: "Pending",
            ride_title: "Going to Tucson this weekend.",
            destination: "Tucson, AZ",
            ride_date: "11-17-2026",
            request_date: "11-15-2026",
            user_name: "Maddux Houseman"
        }
    ]

    // DUMMY conversation response
    const all_conversations = [
        {
            conversation_id: 1,
            user1_id: 1,
            user1_name: "Brenden Matteson",
            user2_id: 3,
            user2_name: "Maddux Houseman",
            created_at: "11-15-2026",
            last_message_at: "11-15-2026 14:30:00" 
        },
        {
            conversation_id: 2,
            user1_id: 1,
            user1_name: "Brenden Matteson",
            user2_id: 2,
            user2_name: "Ava Sabo",
            created_at: "11-15-2026",
            last_message_at: "11-15-2026 12:30:00" 
        }
    ]

    const conversations = all_conversations.filter((element) => element.user1_id == user[0].creator_id || element.user2_id == user[0].creator_id );

    try {
        res.render("notifications.ejs", {
            __dirname,
            __pagename,
            __path,
            user: user[0],
            notifications: notifications,
            conversations: conversations,
        });
    }
    catch (error) 
    {
        console.error("Error loading notifications:", error.stack);
        res.status(500).send("Error loading notifications");
    }
});

app.get("/:id/conversation", async (req, res) => {

    const __path = req.route.path;
    const conversation_id = req.params.id;

    // DUMMY conversation response
    const all_conversations = [
        {
            conversation_id: 1,
            user1_id: 1,
            user1_name: "Brenden Matteson",
            user1_role: "Driver",
            user2_id: 3,
            user2_name: "Maddux Houseman",
            user2_role: "Rider",
            created_at: "11-15-2026",
            last_message_at: "11-15-2026 14:30:00" 
        },
        {
            conversation_id: 2,
            user1_id: 1,
            user1_name: "Brenden Matteson",
            user1_role: "Driver",
            user2_id: 2,
            user2_name: "Ava Sabo",
            user2_role: "Rider",
            created_at: "11-15-2026",
            last_message_at: "11-15-2026 12:30:00" 
        }
    ]

    const conversation = all_conversations.filter((element) => element.conversation_id == conversation_id);

    const all_messages = [
        {
            message_id: 1,
            conversation_id: 1,
            sender_id: 3,
            message_text: "Hey, I have a couple bags, do you have extra cargo space?",
            sent_at: "11-15-2026 14:30:00",
            read_at: "11-15-2026 14:31:00"
        },
        {
            message_id: 2,
            conversation_id: 1,
            sender_id: 1,
            message_text: "Yeah I do",
            sent_at: "11-15-2026 14:32:00",
            read_at: "11-15-2026 14:33:00"
        },
        {
            message_id: 3,
            conversation_id: 1,
            sender_id: 3,
            message_text: "Okay great, thanks",
            sent_at: "11-15-2026 14:34:00",
            read_at: "11-15-2026 14:40:00"
        }
    ]

    const messages = all_messages.reverse();

    try {
        res.render("conversation.ejs", {
            __dirname,
            __path,
            user: user[0],
            conversation: conversation[0],
            messages: messages
        });
    }
    catch (error) 
    {
        console.error("Error loading conversation:", error.stack);
        res.status(500).send("Error loading conversation");
    }
})

// get settings page
app.get("/:id/settings", async (req, res) => {

    const __path = req.route.path;
    const account_id = req.params.id;

    try {
        res.render("settings.ejs", {
            __dirname,
            __path,
            user: user[0]
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