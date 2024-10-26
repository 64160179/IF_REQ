import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import PayOut from "./PayOutModel.js";
import Products from "./ProductModel.js";
import Users from "./UserModel.js";

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
    quantity_approved: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    userId_approved: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Users,
            key: 'id'
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
PayOutDetail.belongsTo(Users, { foreignKey: 'userId_approved', as: 'approvedBy' });

PayOut.hasMany(PayOutDetail, { foreignKey: 'payoutId' });
Products.hasMany(PayOutDetail, { foreignKey: 'productId' });
Users.hasMany(PayOutDetail, { foreignKey: 'userId_approved', as: 'approvedDetails' });

export default PayOutDetail;