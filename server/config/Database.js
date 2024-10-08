import { Sequelize } from "sequelize";

const db = new Sequelize('if_supplies', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    timezone: "+07:00",
});

export default db;