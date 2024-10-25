"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const database_1 = require("./db/database");
dotenv_1.default.config({
    path: './.env'
});
(0, database_1.connectDB)();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1/user', auth_route_1.default);
app.get('/', (req, res) => {
});
app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
});
