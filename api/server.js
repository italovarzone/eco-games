require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const cors = require('cors');
const sendRecoveryEmail = require('./sendEmail');
const { connectDB, sql } = require("./dbConfig");

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); 
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");
initializePassport(passport);

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  res.send("hello");
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

  const pool = await connectDB();

  try {
    const userQuery = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`SELECT * FROM [User] WHERE email = @email`);

    if (userQuery.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .query(`UPDATE [User] SET password = @password WHERE email = @email`);

    res.json({ success: true, message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    res.status(500).json({ message: 'Erro ao atualizar a senha.' });
  }
});

app.post("/api/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

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
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await connectDB();

    try {
      const userCheck = await pool.request()
        .input("email", sql.VarChar, email)
        .query(`SELECT * FROM [User] WHERE email = @email`);

      if (userCheck.recordset.length > 0) {
        return res.status(403).json({ "register": { message: "Email already registered" } });
      } else {
        await pool.request()
          .input("name", sql.VarChar, name)
          .input("email", sql.VarChar, email)
          .input("password", sql.VarChar, hashedPassword)
          .query(`INSERT INTO [User] (name, email, password) VALUES (@name, @email, @password)`);

        res.status(200).json({ "res": "Success" });
      }
    } catch (err) {
      res.status(500).json({ message: "Database error", error: err });
    }
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
  }
);

app.get("/api/isLogged", isAuthenticated, (req, res) => {
  const { password, ...user } = req.user;
  res.send(user);
});

app.post("/api/record/crossworld", isAuthenticated, async (req, res) => {
  const { id, ...user } = req.user;
  const { tempo_record } = req.body;
  const pool = await connectDB();

  try {
    await pool.request()
      .input("id_usuario", sql.Int, id)
      .input("tempo_record", sql.Int, tempo_record)
      .query(`INSERT INTO [Crossworld] (id_usuario, tempo_record, created_at)
              VALUES (@id_usuario, @tempo_record, CURRENT_TIMESTAMP)`);

    res.status(200).json({ "res": "done", "game": "Crossworld" });
  } catch (err) {
    throw err;
  }
});

app.post("/api/record/ecopuzzle", isAuthenticated, async (req, res) => {
  const { id, ...user } = req.user;
  const { tempo_record } = req.body;
  const pool = await connectDB();

  try {
    await pool.request()
      .input("id_usuario", sql.Int, id)
      .input("tempo_record", sql.Int, tempo_record)
      .query(`INSERT INTO [Ecopuzzle] (id_usuario, tempo_record, created_at)
              VALUES (@id_usuario, @tempo_record, CURRENT_TIMESTAMP)`);

    res.status(200).json({ "res": "done", "game": "Ecopuzzle" });
  } catch (err) {
    throw err;
  }
});

app.post("/api/record/hangame", isAuthenticated, async (req, res) => {
  const { id, ...user } = req.user;
  const { tempo_record, quantidade_erros } = req.body;
  const pool = await connectDB();

  try {
    await pool.request()
      .input("id_usuario", sql.Int, id)
      .input("tempo_record", sql.Int, tempo_record)
      .input("quantidade_erros", sql.Int, quantidade_erros)
      .query(`INSERT INTO [Hangame] (id_usuario, tempo_record, quantidade_erros, created_at)
              VALUES (@id_usuario, @tempo_record, @quantidade_erros, CURRENT_TIMESTAMP)`);

    res.status(200).json({ "res": "done", "game": "Hangame" });
  } catch (err) {
    throw err;
  }
});

app.post("/api/record/quiz", isAuthenticated, async (req, res) => {
  const { id, ...user } = req.user;
  const { tempo_record, quantidade_erros } = req.body;
  const pool = await connectDB();

  try {
    await pool.request()
      .input("id_usuario", sql.Int, id)
      .input("tempo_record", sql.Int, tempo_record)
      .input("quantidade_erros", sql.Int, quantidade_erros)
      .query(`INSERT INTO [Quiz] (id_usuario, tempo_record, quantidade_erros, created_at)
              VALUES (@id_usuario, @tempo_record, @quantidade_erros, CURRENT_TIMESTAMP)`);

    res.status(200).json({ "res": "done", "game": "Quiz" });
  } catch (err) {
    throw err;
  }
});

app.get("/api/perfil/info", isAuthenticated, async (req, res) => {
  const { id, ...user } = req.user;
  const pool = await connectDB();

  try {
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
        u.id AS usuario_id,
        u.name AS usuario_nome,
        LEAST(
            COALESCE(e.jogos_ecopuzzle, 0),
            COALESCE(c.jogos_crossworld, 0),
            COALESCE(q.jogos_quiz, 0),
            COALESCE(h.jogos_hangame, 0)
        ) AS jogos_completos,
        COALESCE(e.jogos_ecopuzzle, 0) + COALESCE(c.jogos_crossworld, 0) + 
        COALESCE(q.jogos_quiz, 0) + COALESCE(h.jogos_hangame, 0) AS desafios_vencidos,
        COALESCE(e.tempo_total_ecopuzzle, 0) + COALESCE(c.tempo_total_crossworld, 0) + 
        COALESCE(q.tempo_total_quiz, 0) + COALESCE(h.tempo_total_hangame, 0) AS tempo_total_jogos
        FROM [User] u
        LEFT JOIN (
          SELECT id_usuario, COUNT(*) AS jogos_ecopuzzle, SUM(tempo_record) AS tempo_total_ecopuzzle
          FROM [Ecopuzzle]
          GROUP BY id_usuario
        ) e ON u.id = e.id_usuario
        LEFT JOIN (
          SELECT id_usuario, COUNT(*) AS jogos_crossworld, SUM(tempo_record) AS tempo_total_crossworld
          FROM [Crossworld]
          GROUP BY id_usuario
        ) c ON u.id = c.id_usuario
        LEFT JOIN (
          SELECT id_usuario, COUNT(*) AS jogos_quiz, SUM(tempo_record) AS tempo_total_quiz
          FROM [Quiz]
          GROUP BY id_usuario
        ) q ON u.id = q.id_usuario
        LEFT JOIN (
          SELECT id_usuario, COUNT(*) AS jogos_hangame, SUM(tempo_record) AS tempo_total_hangame
          FROM [Hangame]
          GROUP BY id_usuario
        ) h ON u.id = h.id_usuario
        WHERE u.id = @id;
      `);

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    throw err;
  }
});

app.get("/api/ranking/ecopuzzle", isAuthenticated, async (req, res) => {
  const pool = await connectDB();

  try {
    const result = await pool.request()
      .query(`
        WITH ranked AS (
          SELECT 
            id_usuario,
            RANK() OVER (ORDER BY MIN(tempo_record) ASC) AS posicao,
            u.name AS nome,
            MIN(tempo_record) AS tempo
          FROM [Ecopuzzle] e
          JOIN [User] u ON e.id_usuario = u.id
          GROUP BY id_usuario, u.name
        )
        SELECT * FROM ranked ORDER BY posicao ASC OFFSET 0 ROWS FETCH NEXT 11 ROWS ONLY;
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Erro ao obter ranking de Ecopuzzle:", err);
    res.status(500).json({ error: 'Erro ao obter ranking de Ecopuzzle' });
  }
});


app.get("/api/ranking/crossworld", isAuthenticated, async (req, res) => {
  const pool = await connectDB();

  try {
    const result = await pool.request()
      .query(`
        WITH ranked AS (
          SELECT 
            id_usuario,
            RANK() OVER (ORDER BY MIN(tempo_record) ASC) AS posicao,
            u.name AS nome,
            MIN(tempo_record) AS tempo
          FROM [Crossworld] c
          JOIN [User] u ON c.id_usuario = u.id
          GROUP BY id_usuario, u.name
        )
        SELECT * FROM ranked ORDER BY posicao ASC OFFSET 0 ROWS FETCH NEXT 11 ROWS ONLY;
      `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Erro ao obter ranking de Crossworld:", err);
    res.status(500).json({ error: 'Erro ao obter ranking de Crossworld' });
  }
});

app.get("/api/ranking/quiz", isAuthenticated, async (req, res) => {
  const pool = await connectDB();

  try {
    const result = await pool.request()
      .query(`
        WITH ranked AS (
          SELECT 
            q.id_usuario,
            RANK() OVER (ORDER BY MIN(q.quantidade_erros) ASC, MIN(q.tempo_record) ASC) AS posicao,
            u.name AS nome,
            MIN(q.quantidade_erros) AS erros,
            MIN(q.tempo_record) AS tempo
          FROM [Quiz] q
          JOIN [User] u ON q.id_usuario = u.id
          GROUP BY q.id_usuario, u.name
        )
        SELECT DISTINCT id_usuario, posicao, nome, erros, tempo 
        FROM ranked 
        ORDER BY posicao ASC 
        OFFSET 0 ROWS FETCH NEXT 11 ROWS ONLY;
      `);
      
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Erro ao obter ranking de Quiz:", err);
    res.status(500).json({ error: 'Erro ao obter ranking de Quiz' });
  }
});


app.get("/api/ranking/hangame", isAuthenticated, async (req, res) => {
  const pool = await connectDB();

  try {
    const result = await pool.request()
      .query(`
        WITH ranked AS (
          SELECT 
            id_usuario,
            RANK() OVER (ORDER BY MIN(quantidade_erros) ASC, MIN(tempo_record) ASC) AS posicao,
            u.name AS nome,
            MIN(quantidade_erros) AS erros,
            MIN(tempo_record) AS tempo
          FROM [Hangame] h
          JOIN [User] u ON h.id_usuario = u.id
          GROUP BY id_usuario, u.name
        )
        SELECT * FROM ranked ORDER BY posicao ASC OFFSET 0 ROWS FETCH NEXT 11 ROWS ONLY;
      `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Erro ao obter ranking de Hangame:", err);
    res.status(500).json({ error: 'Erro ao obter ranking de Hangame' });
  }
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
