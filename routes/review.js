  const express = require('express');
  const router = express.Router({ mergeParams: true });
  const Listing = require("../models/listing.js");
  const wrapAsync = require("../utils/wrapAsync");
  const ExpressError = require("../utils/ExpressError.js");
  const { listingSchema,reviewSchema } = require("../schema.js");
  const Review = require("../models/review.js");
  const{validateReview,isLoggedIn,isreviewAuthor} = require("../middleware.js");
  const reviewControllers = require("../controllers/review.js");



  //Review Route
  router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));

  //Delete Review Route
  router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewControllers.deleteReview));
  module.exports = router;