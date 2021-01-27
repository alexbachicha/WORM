'use strict';


module.exports = (sequelize, DataTypes) => {
    const Bookshelf = sequelize.define('Bookshelf', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author:  {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        datePublished : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        pages:  {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        thumbnail: {
                type: DataTypes.STRING,
                allowNull: false,
        },

        infoLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        webReaderLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        }

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