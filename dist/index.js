"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("./routers/data");
const app = (0, express_1.default)();
const port = 3001;
app.get("/", (req, res) => {
    res.send("My server using GraphQL, JWT, Typescript");
});
app.use("/users", data_1.router);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
