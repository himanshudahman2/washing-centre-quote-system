const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Quote = require("./models/Quote");
const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/quote";

// Connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to database");
}

main();

const session = require("express-session");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Set views directory and EJS as view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Index route
app.get("/index", (req, res) => {
  res.render("index");
});

// Instant quote route
app.get("/index/instantquote", (req, res) => {
  res.render("instantquote");
});

app.post("/submit-services", (req, res) => {
  const selectedServices = req.body.services;
  req.session.services = selectedServices;
  console.log(req.session.services);

  if (!selectedServices) {
    return res.redirect("/");
  }

  if (Array.isArray(selectedServices) && selectedServices.length > 1) {
    res.render("multiple-services.ejs", { services: selectedServices });
  } else {
    if (selectedServices === "patio-cleaning") {
      res.render("patio-cleaning.ejs");
    } else if (selectedServices === "window-cleaning") {
      res.render("window.ejs");
    } else if (selectedServices === "soft-wash-home") {
      res.render("home-roof-type.ejs");
    } else if (selectedServices === "gutter-cleaning") {
      res.render("gutter.ejs");
    } else {
      res.redirect("/");
    }
  }
});


// Service details route
app.get("/index/instantquote/general-info", (req, res) => {
  req.session.patioLength = req.query.Patiolength;
  req.session.GutterGuard = req.query.GutterGuard;
  req.session.exteriorType = req.query.exteriorType;
  console.log(` exterior type is  ${req.session.exteriorType}`);

  console.log("Patio Length Saved:", req.session.patioLength); 
  res.render("general-info.ejs");
});

// Personal details route
app.post("/index/instantquote/service-details/personal-details", (req, res) => {
  req.session.homeSize = req.body.homeSize;
  console.log("Home Size Saved:", req.session.homeSize); 
  res.render("personal-details.ejs");
});   

// Additional notes route
app.post(
  "/index/instantquote/service-details/personal-details/Additional-notes",
  async (req, res) => {
   
    const service = req.session.services;
    const homeSize = req.session.homeSize;
    const patioSize = req.session.patioLength;
    const gutterGuard = req.session.GutterGuard;
    const exteriorType = req.session.exteriorType;

    const quote = new Quote({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      countryName: req.body.countryName,
      cityAddress: req.body.cityAddress,
      zipCode: req.body.zipCode,
      companyName: req.body.companyName,
      phoneNumber: req.body.phoneNumber,
      alternatePhone: req.body.alternatePhone,
      services: service,
      homeSize: homeSize,
      Patiolength: patioSize,
      GutterGuard: gutterGuard,
      exteriorType: exteriorType,
    });

    console.log("Quote Object:", quote);

    await quote.save();

    res.render("Additional-notes.ejs");
  }
);

// Thank you route
app.get(
  "/index/instantquote/service-details/personal-details/Additional-notes/thankyou",
  (req, res) => {
    res.render("thankyou-page.ejs");
  }
);

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
