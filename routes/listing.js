const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema,reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// //Index route
// router.get("/", wrapAsync(listingControllers.index));
// //create Route
// router.post("/",isLoggedIn, validateListing,wrapAsync(listingControllers.createListing));
// combination of index and create route
router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingControllers.createListing)
  );

//new route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);
//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);

// //Show routes
// router.get("/:id", wrapAsync(listingControllers.showListing));
// //Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingControllers.updateListing));
// //Delete Route
// router.delete("/:id",isLoggedIn,isOwner, listingControllers.deleteListing);

router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),

    wrapAsync(listingControllers.updateListing)
  )
  .delete(isLoggedIn, isOwner, listingControllers.deleteListing);

module.exports = router;
