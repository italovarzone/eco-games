const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const cors = require('cors');
const app = express();
const sendRecoveryEmail = require('./sendEmail');

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

function generateRecoveryCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const recoveryCodes = {};

app.post('/api/users/send-recovery-code', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'O email é necessário.' });
  }

  const recoveryCode = generateRecoveryCode();
  console.log(`Gerando código: ${recoveryCode}`);

  recoveryCodes[email] = recoveryCode;

  const result = await sendRecoveryEmail(email, recoveryCode);

  if (result.success) {
    res.json({ message: 'Código de recuperação enviado com sucesso!' });
  } else {
    res.status(500).json({ message: 'Erro ao enviar o email de recuperação.', error: result.error });
  }
});

app.post('/api/users/verify-recovery-code', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'O email e o código são necessários.' });
  }

  if (recoveryCodes[email] && recoveryCodes[email] === code) {
    delete recoveryCodes[email];
    res.json({ valid: true, message: 'Código verificado com sucesso!' });
  } else {
    res.json({ valid: false, message: 'Código inválido. Por favor, tente novamente.' });
  }
});

app.post('/api/users/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email e nova senha são necessários.' });
  }

  try {
    const userQuery = await pool.query(
      `SELECT * FROM public."User" WHERE email = $1`,
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE public."User" SET password = $1 WHERE email = $2`,
      [hashedPassword, email]
    );

    res.json({ success: true, message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    res.status(500).json({ message: 'Erro ao atualizar a senha.' });
  }
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
        {
          "res": "done",
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
        {
          "res": "done",
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
        {
          "res": "done",
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
        {
          "res": "done",
          "game": "Quiz"
        });
    }
  );
});

app.get("/api/perfil/info", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  pool.query(
    `SELECT 
    u.id AS usuario_id,
    u.name AS usuario_nome,
    
    -- Jogos Completos: conta o número de vezes que o usuário jogou cada um dos quatro jogos
    LEAST(
        COALESCE(e.jogos_ecopuzzle, 0),
        COALESCE(c.jogos_crossworld, 0),
        COALESCE(q.jogos_quiz, 0),
        COALESCE(h.jogos_hangame, 0)
    ) AS jogos_completos,
    
    -- Desafios Vencidos: soma o número total de jogos jogados pelo usuário
    COALESCE(e.jogos_ecopuzzle, 0) + COALESCE(c.jogos_crossworld, 0) + COALESCE(q.jogos_quiz, 0) + COALESCE(h.jogos_hangame, 0) AS desafios_vencidos,
    
    -- Tempo Total: soma o tempo total gasto em todos os jogos pelo usuário
    COALESCE(e.tempo_total_ecopuzzle, 0) + COALESCE(c.tempo_total_crossworld, 0) + COALESCE(q.tempo_total_quiz, 0) + COALESCE(h.tempo_total_hangame, 0) AS tempo_total_jogos

FROM "User" u
LEFT JOIN (
    SELECT id_usuario, COUNT(*) AS jogos_ecopuzzle, SUM(tempo_record) AS tempo_total_ecopuzzle
    FROM "Ecopuzzle"
    GROUP BY id_usuario
) e ON u.id = e.id_usuario
LEFT JOIN (
    SELECT id_usuario, COUNT(*) AS jogos_crossworld, SUM(tempo_record) AS tempo_total_crossworld
    FROM "Crossworld"
    GROUP BY id_usuario
) c ON u.id = c.id_usuario
LEFT JOIN (
    SELECT id_usuario, COUNT(*) AS jogos_quiz, SUM(tempo_record) AS tempo_total_quiz
    FROM "Quiz"
    GROUP BY id_usuario
) q ON u.id = q.id_usuario
LEFT JOIN (
    SELECT id_usuario, COUNT(*) AS jogos_hangame, SUM(tempo_record) AS tempo_total_hangame
    FROM "Hangame"
    GROUP BY id_usuario
) h ON u.id = h.id_usuario
WHERE u.id = $1;`,
    [id],
    (err, results) => {
      if (err) {
        throw err;
      }
      req.flash("success_msg", "query completed");
      res.status(200).json(results.rows[0]);
    }
  );
});


app.get("/api/ranking/ecopuzzle", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  pool.query(
    `WITH ranked AS (
    SELECT 
        id,
        RANK() OVER (ORDER BY min_tempo_record ASC) AS posicao,
        nome,
        min_tempo_record AS tempo
    FROM (
        SELECT 
            u.id AS id,
            u.name AS nome,
            MIN(e.tempo_record) AS min_tempo_record
        FROM 
            "Ecopuzzle" e
        JOIN 
            "User" u ON e.id_usuario = u.id
        GROUP BY 
            u.id, u.name
    ) AS subquery
)
SELECT *
FROM ranked
WHERE id = $1
UNION ALL
SELECT *
FROM ranked;`,
[id],
    (err, results) => {
      if (err) {
        throw err;
      }
      req.flash("success_msg", "query completed");
      res.status(200).json(results.rows);
    }
  );
});

app.get("/api/ranking/crossworld", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  pool.query(
    `
    WITH ranked AS (
    SELECT 
    id,
    RANK() OVER (ORDER BY min_tempo_record ASC) AS posicao,
    nome,
    min_tempo_record AS tempo
FROM (
    SELECT 
        u.id AS id,
        u.name AS nome,
        MIN(c.tempo_record) AS min_tempo_record
    FROM 
        "Crossworld" c
    JOIN 
        "User" u ON c.id_usuario = u.id
    GROUP BY 
        u.id, u.name
  ) AS subquery
 )
SELECT *
FROM ranked
WHERE id = $1
UNION ALL
SELECT *
FROM ranked;`,
[id],
    (err, results) => {
      if (err) {
        throw err;
      }
      req.flash("success_msg", "query completed");
      res.status(200).json(results.rows);
    }
  );
});

app.get("/api/ranking/quiz", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  pool.query(
    `
  WITH ranked AS (
    SELECT 
    id,
    RANK() OVER (ORDER BY min_quantidade_erros ASC, min_tempo_record ASC) AS posicao,
    nome,
    min_quantidade_erros AS erros,
    min_tempo_record AS tempo
FROM (
    SELECT 
        u.id AS id,
        u.name AS nome,
        MIN(q.quantidade_erros) AS min_quantidade_erros,
        MIN(q.tempo_record) AS min_tempo_record
    FROM 
        "Quiz" q
    JOIN 
        "User" u ON q.id_usuario = u.id
    GROUP BY 
        u.id, u.name
  ) AS subquery
)
  SELECT *
FROM ranked
WHERE id = $1
UNION ALL
SELECT *
FROM ranked;`,
[id],
    (err, results) => {
      if (err) {
        throw err;
      }
      req.flash("success_msg", "query completed");
      res.status(200).json(results.rows);
    }
  );
});

app.get("/api/ranking/hangame", isAuthenticated, (req, res) => {
  const { id, ...user } = req.user;
  pool.query(
    ` WITH ranked AS (
    SELECT 
    id,
    RANK() OVER (ORDER BY min_quantidade_erros ASC, min_tempo_record ASC) AS posicao,
    nome,
    min_quantidade_erros AS erros,
    min_tempo_record AS tempo
FROM (
    SELECT 
        u.id AS id,
        u.name AS nome,
        MIN(h.quantidade_erros) AS min_quantidade_erros,
        MIN(h.tempo_record) AS min_tempo_record
    FROM 
        "Hangame" h
    JOIN 
        "User" u ON h.id_usuario = u.id
    GROUP BY 
        u.id, u.name
) AS subquery
 )
SELECT *
FROM ranked
WHERE id = $1
UNION ALL
SELECT *
FROM ranked;`,
[id],
    (err, results) => {
      if (err) {
        throw err;
      }
      req.flash("success_msg", "query completed");
      res.status(200).json(results.rows);
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