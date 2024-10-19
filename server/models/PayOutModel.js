import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const PayOut = db.define('payout', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
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
    doc_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    doc_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'approved', 'rejected'],
        defaultValue: 'pending',
        allowNull: false,
    },
    pdf_filename: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pdf_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true
});

Users.hasMany(PayOut, { foreignKey: 'userId' });
PayOut.belongsTo(Users, { foreignKey: 'userId' });

export default PayOut;