import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Locations from "./LocationModel.js";
import CountingUnits from "./CountingUnitModel.js";

const {DataTypes} = Sequelize;

const Products = db.define('products',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    visible: {
        type: DataTypes.ENUM,
        values: ['visible', 'hidden'],
        defaultValue: 'visible',
        allowNull: false
    },
    locationId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Locations,
            key: 'id'
        },
        validate:{
            notEmpty: true
        }
    },
    countingunitId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CountingUnits,
            key: 'id'
        },
        validate:{
            notEmpty: true
        }
    },
},{
    freezeTableName: true,
    timestamps: true
});

Locations.hasMany(Products, {foreignKey: 'locationId'});
Products.belongsTo(Locations, {foreignKey: 'locationId'});

CountingUnits.hasMany(Products, {foreignKey: 'countingunitId'});
Products.belongsTo(CountingUnits, {foreignKey: 'countingunitId'});

export default Products;