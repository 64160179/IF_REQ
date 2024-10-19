import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import PayOut from "./PayOutModel.js";
import Products from "./ProductModel.js";

const { DataTypes } = Sequelize;

const PayOutDetail = db.define("payoutDetail", {
    payoutId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PayOut,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Products,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    summary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true,
    timestamps: true
});

PayOutDetail.belongsTo(PayOut, { foreignKey: 'payoutId' });
PayOutDetail.belongsTo(Products, { foreignKey: 'productId' });

PayOut.hasMany(PayOutDetail, { foreignKey: 'payoutId' });
Products.hasMany(PayOutDetail, { foreignKey: 'productId' });

export default PayOutDetail;