"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config/config"));
const index_1 = __importDefault(require("./routes/index"));
const logging_1 = __importDefault(require("./config/logging"));
const mongoose_1 = __importDefault(require("mongoose"));
require("./schedules/volumeStat");
require("./schedules/liquidityStat");
require("./schedules/updateTokenPrice");
const NAMESPACE = "Server";
const app = (0, express_1.default)();
/** mongoose connection */
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then((result) => {
    logging_1.default.info(NAMESPACE, "Mongo Connected");
})
    .catch((error) => {
    logging_1.default.error(NAMESPACE, error.message, error);
});
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
/** import router */
app.use("/", index_1.default);
/** Error handling */
app.use((req, res, next) => {
    const error = new Error("Not found");
    res.status(404).json({
        message: error.message,
    });
});
const httpServer = http_1.default.createServer(app);
httpServer.listen(config_1.default.server.port, () => {
    logging_1.default.info(NAMESPACE, `Server is running ${config_1.default.server.hostname}:${config_1.default.server.port}`);
});
//# sourceMappingURL=index.js.map