'use strict';


module.exports = (sequelize, DataTypes) => {
    const Bookshelf = sequelize.define('Bookshelf', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author:  {
            type: DataTypes.STRING,
            allowNull: true,
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
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        ISBN: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        viewerID: {
            type: DataTypes.STRING,
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