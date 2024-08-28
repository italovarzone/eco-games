const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Origem do front-end
  res.header("Access-Control-Allow-Credentials", "true"); // Permite cookies
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");

initializePassport(passport);

// Middleware

// Parses details from a form
app.use(express.json());

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false,
    cookie: { 
      httpOnly: true, 
      secure: false,
      sameSite: 'none', 
    }
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  res.send("hello")
});

app.post("/api/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2
  });

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.status(403).json({ "register": { errors, name, email, password, password2 } });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM public."User"
          WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.status(403).json({
            "register": {
              message: "Email already registered"
            }
          });
        } else {
          pool.query(
            `INSERT INTO public."User" (name, email, password)
                  VALUES ($1, $2, $3)
                  RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.status(200).json({ "res": "Suceccs" });
            }
          );
        }
      }
    );
  }
});

app.post(
  "/api/users/login",
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Erro no servidor" });
      }
      if (!user) {
        return res.status(401).json({ message: "Falha na autenticação", error: info.message, booleanAuth: false });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Erro ao iniciar sessão" });
        }
        return res.status(200).json({ message: "Autenticação bem-sucedida", booleanAuth: true });
      });
    })(req, res, next);
  });

app.get("/api/isLogged", isAuthenticated, (req, res) => {
  console.log(req.user);
  const { password, ...user } = req.user;
  res.send(user);
});

app.post("/api/record/crossworld", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  const { tempo_record } = req.body;
  pool.query(
    `INSERT INTO public."Crossworld" (id, id_usuario, tempo_record, created_at)
      VALUES(nextval('"Crossworld_id_seq"'::regclass), $1, $2, CURRENT_TIMESTAMP);`,
    [id, tempo_record],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      req.flash("success_msg", "You are now records");
      res.status(200).json(
        { "res": "done",
          "game": "Crossworld"
         });
    }
  );
});

app.post("/api/record/ecopuzzle", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  const { tempo_record } = req.body;
  pool.query(
    `INSERT INTO public."Ecopuzzle"
     (id, id_usuario, tempo_record, created_at)
     VALUES(nextval('"Ecopuzzle_id_seq"'::regclass), $1, $2, CURRENT_TIMESTAMP);`,
    [id, tempo_record],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      req.flash("success_msg", "You are now records");
      res.status(200).json(
        { "res": "done",
          "game": "Ecopuzzle"
         });
    }
  );
});

app.post("/api/record/hangame", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  const { tempo_record, quantidade_erros } = req.body;
  pool.query(
    `INSERT INTO public."Hangame"
     (id, id_usuario, tempo_record, quantidade_erros, created_at)
     VALUES(nextval('"Hangame_id_seq"'::regclass), $1, $2, $3, CURRENT_TIMESTAMP);`,
    [id, tempo_record, quantidade_erros],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      req.flash("success_msg", "You are now records");
      res.status(200).json(
        { "res": "done",
          "game": "Hangame"
         });
    }
  );
});

app.post("/api/record/quiz", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  const { tempo_record, quantidade_erros } = req.body;
  pool.query(
    `INSERT INTO public."Quiz"
     (id, id_usuario, tempo_record, quantidade_erros, created_at)
     VALUES(nextval('"Quiz_id_seq"'::regclass), $1, $2, $3, CURRENT_TIMESTAMP);`,
    [id, tempo_record, quantidade_erros],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      req.flash("success_msg", "You are now records");
      res.status(200).json(
        { "res": "done",
          "game": "Quiz"
         });
    }
  );
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Não autenticado" });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});