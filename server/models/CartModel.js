import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Cart = db.define('cart', {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        },
        validate: {
            notEmpty: true,
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
}, {
    freezeTableName: true,
    timestamps: true
});

Products.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Products, { foreignKey: 'productId' });

Users.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(Users, { foreignKey: 'userId' });

export default Cart;