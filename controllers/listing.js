const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { q } = req.query;
  let allListings;
  console.log(q);

  if (q) {
    const regex = new RegExp(q, "i"); // case-insensitive
    allListings = await Listing.find({
      $or: [{ title: regex }, { location: regex }, { country: regex }],
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render("./listings/index.ejs", { allListings, searchQuery: q || "" });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listing");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // if(!newListing.description){
  //   throw new ExpressError(400,'description is missing')

  // }
  // if(!newListing.location){
  //   throw new ExpressError(400,'Location is missing')

  // }
  // if(!newListing.title){
  //   throw new ExpressError(400,'Title is missing')
  // }
  //console.log(listingSchema)
  //let result = listingSchema.validate(req.body);
  // console.log(result)
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Set the owner to the logged-in user
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listing");
  }
  res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  console.log("Body:", req.body);
  console.log("File:", req.file);
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  console.log(listing);
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect("/listing");
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listing");
};
