const path = require("path");

if (process.env.NODE_ENV == "production") {
    module.exports = {
        PORT: process.env.PROD_PORT,
        BASE_PATH: path.join(__dirname),
        FRONTEND_HOST: process.env.PRODUCTION_FRONTEND_HOST,
        BACKEND_HOST: process.env.PRODUCTION_BACKEND_HOST,
    };
} else {
    module.exports = {
        PORT: process.env.DEV_PORT,
        BASE_PATH: path.join(__dirname),
        FRONTEND_HOST: process.env.DEVELOPMENT_FRONTEND_HOST,
        BACKEND_HOST: process.env.DEVELOPMENT_BACKEND_HOST,
    };
}
