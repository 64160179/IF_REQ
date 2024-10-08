import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import LocationRoute from "./routes/LocationRoute.js";
import CountingRoute from "./routes/CountingRoute.js";
import BuyInRoute from "./routes/BuyInRoute.js";
import PayOutRoute from "./routes/PayOutRoute.js";
import WareHouseRoute from "./routes/WareHouseRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

// (async () => {
//     try {
//         // ซิงค์โมเดลกับฐานข้อมูล
//         await db.sync();
//         console.log("Database synced successfully.");
//     } catch (error) {
//         console.error("Unable to sync database:", error);
//     }
// })();

// store.sync();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));


app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());

app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(LocationRoute);
app.use(CountingRoute);
app.use(BuyInRoute);
app.use(PayOutRoute);
app.use(WareHouseRoute);

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running on port 5000 ...');
});