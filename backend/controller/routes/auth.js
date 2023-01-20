import { Router } from "express";
import bcrypt from "bcryptjs";
import connection from "../../model/database.js";
import util from "util";
import jwt from "jsonwebtoken";
import protected_auth_middleware from "../middleware/protectedAuth.js";
const query = util.promisify(connection.query).bind(connection);
import * as dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

const router = Router();

const registrationSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
  confirmPassword: z.string().min(8).max(20),
});

const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
});

router.get("/users/me", protected_auth_middleware, async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json(req.user);
    }
  } catch (error) {
    res.status(500).send("server error");
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    const isValid = registrationSchema.safeParse({
      username,
      password,
      confirmPassword,
    });

    if (!isValid.success) {
      return res.status(400).json({ error: isValid.error });
    }

    const existingUser = await query(
      "SELECT * FROM Users WHERE username = ?",
      username
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const results = await query(
      "INSERT INTO Users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    const payload = {
      user: {
        id: results.insertId,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const isValid = loginSchema.safeParse({
    username,
    password,
  });

  if (!isValid.success) {
    console.log(isValid.error.flatten());
    return res.status(400).json({ error: isValid.error.flatten().f });
  }

  try {
    const response = await query("SELECT * FROM Users WHERE username=?", [
      username,
    ]);
    if (response.length == 0) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid username or password!" }] });
    }
    if (await bcrypt.compare(password, response[0].password)) {
      const payload = {
        user: {
          id: response[0].id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid email or password!" }] });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;
