require("dotenv").config();
let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let logger = require("morgan");
let cors = require("cors");
let mongoose = require("mongoose");
const bodyParser = require("body-parser");

//database connection
mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .catch((error) => console.log("Database connection error =>>", error));
mongoose.set("debug", true);

global.ObjectId = mongoose.Types.ObjectId;
global.site_url = process.env.SITE_URL;
global.FUNC = require("./libs/functions");
global.httpStatus = require("http-status-codes");
global.MSG = require("./libs/local.en");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./libs/swagger.yaml");


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//app routes
app.use("/", require("./routes/index"));
app.use("/api",require("./routes/api/index"))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(httpStatus.NOT_FOUND));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
    res.render("error");
});

module.exports = app;
