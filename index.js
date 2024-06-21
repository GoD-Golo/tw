const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const client = require("./db");
const PORT = 8080;

const multer = require("multer");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Utilizator = require("./utilizator");
const AccesBD = require("./AccesBD");
const upload = multer({ dest: "uploads/" });
const session = require("express-session");

const folderScss = path.join(__dirname, "public", "scss");
const folderCss = path.join(__dirname, "public", "css");

const sass = require("sass");
const { get } = require("http");

function compileazaScss(caleScss, caleCss) {
  const inputPath = path.isAbsolute(caleScss)
    ? caleScss
    : path.join(folderScss, caleScss);
  const outputPath = caleCss
    ? path.isAbsolute(caleCss)
      ? caleCss
      : path.join(folderCss, caleCss)
    : path.join(folderCss, caleScss.replace(".scss", ".css"));

  // Backup existing CSS file
  if (fs.existsSync(outputPath)) {
    const backupPath = path.join(
      folderCss,
      "backup",
      path.basename(outputPath)
    );
    fs.copyFileSync(outputPath, backupPath);
  }

  // Compile SCSS to CSS
  const result = sass.renderSync({ file: inputPath });
  fs.writeFileSync(outputPath, result.css);
}

fs.readdir(folderScss, (err, files) => {
  if (err) {
    console.error("Error reading SCSS directory", err);
    return;
  }
  files.forEach((file) => {
    if (path.extname(file) === ".scss") {
      compileazaScss(file);
    }
  });
});

fs.watch(folderScss, (eventType, filename) => {
  if (filename && path.extname(filename) === ".scss") {
    compileazaScss(filename);
  }
});

compileazaScss("custom.scss");

// Setăm motorul de template EJS
app.set("view engine", "ejs");

// Definim directorul pentru fișiere statice
app.use("/public", express.static(path.join(__dirname, "public")));

// Variabilă globală pentru erori
let obGlobal = {
  obErori: null,
};

// Funcția de inițializare a erorilor
function initErori() {
  let rawdata = fs.readFileSync(path.join(__dirname, "erori.json"));
  let erori = JSON.parse(rawdata);
  obGlobal.obErori = erori;
  obGlobal.obErori.info_erori.forEach((eroare) => {
    eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
  });
}

// Funcția de afișare a erorilor
function afisareEroare(res, identificator, titlu, text, imagine) {
  let eroare =
    obGlobal.obErori.info_erori.find(
      (err) => err.identificator === identificator
    ) || obGlobal.obErori.eroare_default;
  res
    .status(eroare.status ? eroare.identificator : 200)
    .render("pagini/error", {
      titlu: titlu || eroare.titlu,
      text: text || eroare.text,
      imagine: imagine || eroare.imagine,
    });
}

// Inițializăm erorile la pornirea serverului
initErori();

app.get(["/", "/index", "/home"], (req, res) => {
  res.render("pagini/index");
});

// Function to get distinct categories from the database
async function getCategories() {
  const result = await client.query(
    "SELECT DISTINCT categorie_mare FROM Products"
  );
  return result.rows.map((row) => row.categorie_mare);
}

// Function to get all products from the database
async function getProducts() {
  const result = await client.query("SELECT * FROM Products");
  return result.rows;
}

async function getProduct(id) {
  try {
    const result = await client.query("SELECT * FROM Products WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      throw new Error("Produsul nu a fost găsit");
    }
  } catch (error) {
    console.error("Eroare la obținerea produsului:", error);
    throw error;
  }
}

// Route handler for products page
app.get("/produse", async (req, res) => {
  try {
    const categorii = await getCategories();
    const produse = await getProducts();
    res.render("pagini/produse", { categorii, produse });
  } catch (err) {
    console.error("Error fetching products or categories", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/produs/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await getProduct(productId);
    if (product) {
      res.render("pagini/produs", { produs: product });
    } else {
      res.status(404).render("pagini/error", {
        titlu: "Produs negăsit",
        text: "Produsul cerut nu există.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).render("pagini/error", {
      titlu: "Eroare server",
      text: "A apărut o eroare pe server.",
    });
  }
});

app.get("/galerie", (req, res) => {
  const galleryJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "resurse", "galerie.json"))
  );

  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const filteredImages = galleryJson.imagini.filter((imagine) =>
    imagine.luni.includes(currentMonth)
  );

  const galerie = {
    cale_galerie: galleryJson.cale_galerie,
    imagini: filteredImages,
  };

  res.render("pagini/galerie", { galerie });
});

app.get("/*", (req, res, next) => {
  let path = req.params[0];
  res.render("pagini/" + path, (err, html) => {
    if (err) {
      if (err.message.includes("Failed to lookup view")) {
        afisareEroare(res, 404);
      } else {
        afisareEroare(res, 500);
      }
    } else {
      res.send(html);
    }
  });
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "resurse", "ico", "favicon.ico"));
});

console.log("Path to index.js: ", __filename);
console.log("Directory name: ", __dirname);
console.log("Current working directory: ", process.cwd());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Utilizatori

// Configurarea middleware-ului pentru sesiuni
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false, // Asigură-te că sesiunile neinițializate nu sunt salvate
    cookie: { secure: false }, // Setează secure: true doar dacă folosești HTTPS
  })
);

// Middleware pentru a popula req.session.user pentru fiecare request
app.use((req, res, next) => {
  if (!req.session.user) {
    req.session.user = null;
  }
  next();
});

app.use(express.urlencoded({ extended: true }));

app.post("/register", upload.single("fotografie"), async (req, res) => {
  const {
    nume,
    prenume,
    username,
    parola,
    email,
    data_nasterii,
    culoare_chat,
    problema_vedere,
    u,
  } = req.body;

  // Verificare username existent
  const existingUser = await Utilizator.getUtilizDupaUsernameAsync(username);
  if (existingUser) {
    return res.status(400).send("Username-ul deja exista.");
  }

  // Criptare parolă
  const hashedPassword = await bcrypt.hash(parola, 10);

  // Salvare fotografie
  let fotografiePath = null;
  if (req.file) {
    fotografiePath = req.file.path;
  }

  const newUser = new Utilizator({
    nume,
    prenume,
    username,
    parola: hashedPassword,
    email,
    data_nasterii,
    culoare_chat,
    problema_vedere: !!problema_vedere,
    fotografie: fotografiePath,
    rol: "comun",
  });

  try {
    await newUser.salvareUtilizator();

    // Trimitere email de confirmare
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "golo.tehnici.web@gmail.com",
        pass: "TehniciWeb321",
      },
    });

    const mailOptions = {
      from: "golo.tehnici.web@gmail.com",
      to: email,
      subject: "Mesaj înregistrare",
      html: `Pe EcoHaven ai username-ul ${username}, începând de azi, <span style="color: purple;">${new Date().toLocaleDateString()}</span>`,
    };

    await transporter.sendMail(mailOptions);

    res.redirect("/login");
  } catch (err) {
    res.status(500).send(`Eroare la înregistrare. ${err.message}`);
  }
});

// Ruta de login în app.js
app.post("/login", async (req, res) => {
  const { username, parola } = req.body;

  try {
    const user = await Utilizator.getUtilizDupaUsernameAsync(username);

    if (user && bcrypt.compareSync(parola, user.parola)) {
      req.session.user = user;
      const utilizator = user;
      res.render("pagini/profil", { utilizator });
    } else {
      res.status(401).send("Username sau parolă incorecte");
    }
  } catch (err) {
    res.status(500).send("Eroare la autentificare: " + err.message);
  }
});

// Ruta pentru pagina de profil
app.get("/profil", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const user = await Utilizator.getUtilizDupaUsernameAsync(
    req.session.user.username
  );
  res.render("profil", { user });
});

// Ruta de login în app.js
app.post("/login", async (req, res) => {
  const { username, parola } = req.body;

  const user = await Utilizator.getUtilizDupaUsernameAsync(username);
  if (!user) {
    return res.status(400).send("Username sau parola greșită.");
  }

  const validPassword = await bcrypt.compare(parola, user.parola);
  if (!validPassword) {
    return res.status(400).send("Username sau parola greșită.");
  }

  // Setare sesiune
  req.session.user = user;
  res.redirect("/profil");
});

// Ruta pentru pagina de profil
app.get("/profil", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const user = await Utilizator.getUtilizDupaUsernameAsync(
    req.session.user.username
  );
  res.render("profil", { user });
});
