import connection from "../model/database.js";
import util from "util";
let query = util.promisify(connection.query).bind(connection);
import cors from "cors";
import express from "express";
import authRouter from "../controller/routes/auth.js";

// importing all the model files
import Actor from "../model/Actor.js";
import Film from "../model/Film.js";
import Customer from "../model/Customer.js";
import { triggerAsyncId } from "async_hooks";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("BED Assignment REST API Running");
});

// Endpoint 1
app.get("/actors/:actor_id", async (req, res) => {
  const actor_id = req.params.actor_id;
  try {
    const response = await Actor.getActorById({ actor_id });
    if (response.length === 0) {
      return res
        .status(204)
        .send("No Content. Record of given actor_id cannot be found.");
    }
    return res.status(200).json(response[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_msg: "Internal server error",
    });
    // return res.status(500).send("Server error in @GET /actors/:actor_id");
  }
});

// Endpoint 2
app.get("/actors", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const response = await Actor.getAllActors({ limit, offset });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_msg: "Internal server error",
    });
    // return res.status(500).send("Server error in @GET /actors");
  }
});

// Endpoint 3
app.post("/actors", async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    if (!first_name || !last_name) {
      return res.status(400).json({
        error_msg: "missing data",
      });
    }

    const response = await Actor.createActor({ first_name, last_name });
    return res.status(200).json({ actor_id: response.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_msg: "Internal server error",
    });
    // return res.status(500).send("Server error in @POST /actors");
  }
});

// Endpoint 4
app.put("/actors/:actor_id", async (req, res) => {
  let { first_name, last_name } = req.body;
  const { actor_id } = req.params;
  if (!first_name && !last_name) {
    return res.status(400).json({
      error_msg: "missing data",
    });
    // return res
    //   .status(400)
    //   .send("Missing first_name or last_name in request body");
  }
  try {
    let response = await query("SELECT * FROM actor WHERE actor_id =?", [
      actor_id,
    ]);
    if (response.length === 0) {
      return res
        .status(204)
        .send("No Content. Record of given actor_id cannot be found.");
    }
    // validate body
    if (!first_name) {
      first_name = response[0].first_name;
    }
    if (!last_name) {
      last_name = response[0].last_name;
    }
    await Actor.updateActor({ actor_id, first_name, last_name });
    return res.status(200).json({
      success_msg: "record updated",
    });
    // return res.status(200).send("Record updated!");
  } catch (error) {
    return res.status(500).json({
      error_msg: "Internal server error",
    });
    // return res.status(500).send("Server error in @PUT /actors/:actor_id");
  }
});

// Endpoint 5
app.delete("/actors/:actor_id", async (req, res) => {
  const { actor_id } = req.params;
  try {
    const response = await query("SELECT * FROM actor where actor_id=?", [
      actor_id,
    ]);
    if (response.length === 0) {
      return res.status(204).send("No content.");
    }
    await Actor.deleteActor({ actor_id });
    return res.status(200).json({
      success_msg: "actor deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error_msg: "Internal server error",
    });
    // return res.status(500).send("Server error in @DELETE /actors/:actor_id");
  }
});

// Endpoint 6
app.get("/film_categories/:category_id/films", async (req, res) => {
  // get films from a categoryid
  const { category_id } = req.params;
  try {
    const response = await Film.getFilmsByCategoryId({ category_id });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_msg: "Internal server error",
    });
    // .send("Server error in @GET /film_categories/:category_id/films");
  }
});

// endpoint 7
app.get("/customer/:customer_id/payment", async (req, res) => {
  const { customer_id } = req.params;
  const { start_date, end_date } = req.query;
  try {
    const payment_response = await Customer.getPayment({
      customer_id,
      start_date,
      end_date,
    });

    const aggregate_response = await Customer.getPaymentAggregate({
      customer_id,
      start_date,
      end_date,
    });
    let total = aggregate_response[0].total;
    if (payment_response.length === 0) {
      total = 0;
    }

    return res.status(200).json({
      rental: payment_response,
      total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_msg: "Internal server error",
    });
    // .send("Server error in @GET /film_categories/:category_id/films");
  }
});

// endpoint 8
app.post("/customers", async (req, res) => {
  try {
    const { first_name, last_name, store_id, email, address } = req.body;
    if (!address) {
      return res.status(400).json({
        error_msg: "missing data",
      });
    }
    const {
      address_line1,
      address_line2,
      district,
      city_id,
      postal_code,
      phone,
    } = address;
    // check if any data is missing from the body
    if (
      !first_name ||
      !last_name ||
      !store_id ||
      !email ||
      !address_line1 ||
      !district ||
      !city_id ||
      !postal_code ||
      !phone
    ) {
      return res.status(400).json({
        error_msg: "missing data",
      });
    }
    let response = await query(
      "SELECT email from customer WHERE email LIKE ?",
      [email]
    );
    if (response.length !== 0) {
      return res.status(409).json({
        error_msg: "email already exist",
      });
    }
    let address_response = await Customer.createAddress({
      address_line1,
      address_line2,
      district,
      city_id,
      postal_code,
      phone,
    });

    response = await Customer.createCustomer({
      first_name,
      last_name,
      store_id,
      email,
      address_id: address_response.insertId,
    });
    let insertId = response.insertId;
    return res.status(200).json({ customer_id: insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_msg: "Internal server error",
    });
    // return res.status(500).send("Server error in @POST /actors");
  }
});

// Additional endpoint 1
// endpoint 9
app.post("/inventory", async (req, res) => {
  try {
    const { film_name, address } = req.body;
    if (!film_name || !address) {
      return res.status(400).json({
        error_msg: "missing data",
      });
    }

    let response = await query("SELECT * FROM film WHERE title LIKE ?", [
      film_name,
    ]);
    if (response.length === 0) {
      // no film found with that name
      return res.status(400).json({
        error_msg: "No film with that name found",
      });
    }
    let film_id = response[0].film_id;

    response = await query(
      "SELECT * FROM store WHERE address_id IN (SELECT address_id FROM address WHERE address LIKE ?)",
      [address]
    );
    if (response.length === 0) {
      // no store found with that address
      return res.status(400).json({
        error_msg: "No store with that address found",
      });
    }

    let store_id = response[0].store_id;
    response = await query(
      "INSERT INTO inventory (film_id, store_id) VALUES (?, ?)",
      [film_id, store_id]
    );

    return res.status(200).json({ inventory_id: response.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_msg: "Internal server error",
    });
  }
});

// Endpoint 10
app.post("/rental/:customer_id", async (req, res) => {
  // Endpoint 10 - e.g /api/rental/20
  let {
    rental_date,
    inventory_id,
    return_date,
    staff_id,
    amount,
    payment_date,
  } = req.body;
  const { customer_id } = req.params;

  try {
    if (
      !rental_date ||
      !inventory_id ||
      !return_date ||
      !staff_id ||
      !amount ||
      !payment_date ||
      !customer_id
    ) {
      return res.status(400).send({ error_msg: "missing data" });
    }
    // insert rental data
    const rentalResponse = await query(
      `INSERT INTO rental(rental_date, inventory_id, customer_id, return_date, staff_id) VALUES (?, ?, ?, ?, ?);`,
      [rental_date, inventory_id, customer_id, return_date, staff_id]
    );
    const rentalId = rentalResponse.insertId;

    // insert payment data
    const paymentResponse = await query(
      `INSERT INTO payment(customer_id, staff_id, rental_id, amount, payment_date) VALUES (?, ?, ?, ?, ?);`,
      [customer_id, staff_id, rentalId, amount, payment_date]
    );
    const paymentId = paymentResponse.insertId;
    res.status(201).send({ rental_id: rentalId, payment_id: paymentId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error_msg: "Internal server error" });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const data = new Map();
    let transaction_data = await query(
      `SELECT amount, payment_date FROM payment`
    );
    for (let i = 0; i < transaction_data.length; i++) {
      let { amount, payment_date } = transaction_data[i];
      amount = parseFloat(amount);
      payment_date = payment_date.toISOString().split("T")[0];
      if (data.has(payment_date)) {
        data.set(payment_date, data.get(payment_date) + amount);
      } else {
        data.set(payment_date, amount);
      }
    }
    // convert data into an array of objects with the shape {date: "2020-01-01", amount: 100}
    const result = [];
    for (let [key, value] of data) {
      result.push({ date: key, amount: value });
    }
    return res.json(result).status(200);
  } catch (error) {
    console.error(err);
    res.status(500).send({ error_msg: "Internal server error" });
  }
});

app.get("/api/films", async (req, res) => {
  let { page, per_page, search, category, rental_rate } = req.query;
  search = search || "";
  category = category || "";
  if (isNaN(rental_rate) || rental_rate === "") rental_rate = 999999;
  rental_rate = parseFloat(rental_rate);

  search = "%" + search + "%";
  category = "%" + category + "%";

  per_page = parseInt(per_page);
  page = page || 1;
  try {
    let films = await query(
      `SELECT category.name as name, film.title as title, film.film_id as id, film.description as description, \
      film.rating as rating\
      FROM film join film_category\
      on film.film_id = film_category.film_id\
      join category on film_category.category_id = category.category_id\
      WHERE LOWER(category.name) LIKE ?\
      AND LOWER(film.title) LIKE ?\
      AND film.rental_rate <= ?\
      LIMIT ${per_page} OFFSET ?`,
      [
        category.toLowerCase(),
        search.toLowerCase(),
        rental_rate,
        (page - 1) * per_page,
      ]
    );
    res.status(200).json(films);
  } catch (error) {
    console.error(error);
    res.status(500).json([{ msg: "Internal server error" }]);
  }
});

app.get("/api/films/:slug", async (req, res) => {
  let { slug } = req.params;
  slug = slug.replace(/-/g, " ");
  let prepared_statment = `SELECT \
  language.name as language, category.name as category,\
  rental_duration, rental_rate, length, replacement_cost, special_features,\
  film.title as title, film.release_year as release_year,\
  film.film_id as id, film.description as description, \
  film.rating as rating\
  FROM film join film_category\
  on film.film_id = film_category.film_id\
  join category on film_category.category_id = category.category_id\
  join language on film.language_id = language.language_id\
  WHERE film.title = ?`;

  let prepared_statment_actors = `SELECT actor.first_name as first_name, actor.last_name as last_name\
  FROM film join film_actor\
  on film.film_id = film_actor.film_id\
  join actor on film_actor.actor_id = actor.actor_id\
  WHERE film.title = ?`;

  try {
    let film = await query(prepared_statment, [slug]);
    if (film.length === 0) {
      return res.status(404).json([{ msg: "No film with that title found" }]);
    }

    let actors = await query(prepared_statment_actors, [slug]);
    actors = actors.map((actor) => {
      actor.first_name = actor.first_name.toLowerCase();
      actor.last_name = actor.last_name.toLowerCase();
      // capitalize first letter of first and last name
      actor.first_name =
        actor.first_name.charAt(0).toUpperCase() + actor.first_name.slice(1);
      actor.last_name =
        actor.last_name.charAt(0).toUpperCase() + actor.last_name.slice(1);
      return actor.first_name + " " + actor.last_name;
    });
    film[0].actors = actors;

    res.status(200).json(film[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json([{ msg: "Internal server error" }]);
  }
});

app.get("/api/stores", async (req, res) => {
  try {
    let stores = await query(`SELECT store.store_id, address.address FROM store\
    JOIN address ON store.address_id = address.address_id`);
    res.status(200).json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json([{ msg: "Internal server error" }]);
  }
});

app.get("/api/cities", async (req, res) => {
  try {
    let cities = await query(`SELECT city, city_id from city`);
    res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json([{ msg: "Internal server error" }]);
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    let categories = await query(`SELECT name FROM category`);
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json([{ msg: "Internal server error" }]);
  }
});

app.use("/auth", authRouter);

app.listen(8000, () => {
  console.log("BED CA1 Running on http://localhost:" + 8000);
});
