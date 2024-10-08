import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";

const { DataTypes } = Sequelize;

const PayOut = db.define('payout', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Products,
            key: 'id'
        },
        validate: {
            notEmpty: true,
        }
    },
    quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    summary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true
});

Products.hasMany(PayOut, { foreignKey: 'productId' });
PayOut.belongsTo(Products, { foreignKey: 'productId' });

export default PayOut;