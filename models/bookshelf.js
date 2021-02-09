'use strict';


module.exports = (sequelize, DataTypes) => {
    const Bookshelf = sequelize.define('Bookshelf', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author:  {
            type: DataTypes.STRING,
            defaultValue: "none listed in metadata",
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: "None given",
            allowNull: true,
        },
        datePublished : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        pages:  {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
        thumbnail: {
            type: DataTypes.STRING,
            defaultValue: "no thumbnail available",
            allowNull: false,
        },

        infoLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        webReaderLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    })

    Bookshelf.associate = (models) => {
        Bookshelf.belongsTo(models.User, {
            foreignKey: {
            allowNull: false
            }
        })
    }

    return Bookshelf
}