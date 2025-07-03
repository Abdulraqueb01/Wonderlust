if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
// const wrapAsync = require("./utils/wrapAsync");
// const { listingSchema,reviewSchema } = require("./schema.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

app.get("/", (req, res) => {
  res.send("hi,I am root");
});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: SECRET,
  },
  touchAfter: 24 * 3600, //used to make session availabe for long time so that user need not to login again and again
});
store.on("error", (err) => {
  console.log("error in mongo session store", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true, // Helps prevent XSS attacks
  },
};
app.use(session(sessionOptions));
app.use(flash());
//passport should be initialized after session middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Make currentUser available in all templates
  next();
});

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    console.error("Error occurred after headers were sent:", err.message);
    return next(err);
  }
  //console.log(err.message)
  const { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});
app.listen(7070, () => {
  console.log("port is connected on 7070");
});

//app.get("/demouser",async  (req, res) => {
//   let sampleUser = new User({
//     username: "demoUser2",
//     email: "student2@gmail.com",
//   });
//   let registeredUser = await User.register(sampleUser, "demopassword");
//   res.send(registeredUser)
// });
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the Beach",
//     price: 1200,
//     location: "calanqute,Goa",
//     country: "India",
//   });
//   //await sampleListing.save();

//   console.log("sample was saved");
//   res.send("successful testing");
// });

//create Route
// app.post("/listing", async (req, res,next) => {
//  try{
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listing");
//  }catch(err){
//   next(err);
//  }
// });
//above one or below both are valid
