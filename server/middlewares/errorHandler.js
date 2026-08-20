const errorHandler = (error, req, res, next) => {
  console.log(error);

  let status = 500;
  let message = "Internal server error";

  if (error.name == "SequelizeValidationError") {
    status = 400;
    message = error.errors[0].message;
  }

  if (error.name == "SequelizeUniqueConstraintError") {
    status = 400;
    message = error.errors[0].message;
  }

  if (error.name == "LoginEmail") {
    status = 400;
    message = "Email is required";
  }

  if (error.name == "LoginPassword") {
    status = 400;
    message = "Password is required";
  }

  if (error.name == "LoginError") {
    status = 401;
    message = "Invalid email/password";
  }

  if (error.name == "Unauthorized") {
    status = 401;
    message = "Invalid token";
  }

  if (error.name == "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }

  if (error.name == "Forbidden") {
    status = 403;
    message = "You are not authorized";
  }

  if (error.name == "NotFound") {
    status = 404;
    message = "Data not found";
  }

  if (error.name == "BidInvalidAmount") {
    status = 400;
    message = "Bid amount is required and must be a number";
  }

  if (error.name == "AuctionNotLive") {
    status = 400;
    message = "This auction is not live";
  }

  if (error.name == "AuctionNotInRange") {
    status = 400;
    message = "This auction is not currently active";
  }

  if (error.name == "BidTooLow") {
    status = 400;
    message = `Bid must be at least ${error.minimumBid}`;
  }

  if (error.name == "AIParseError") {
    status = 502;
    message = "Failed to get a valid response from AI, please try again";
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
