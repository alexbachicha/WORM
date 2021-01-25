
module.exports = (sequelize, DataTypes) => {
    const Bookshelf = sequelize.define('Bookshelf', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author:  {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        datePublished : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        pages:  {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        thumbnail: {
                type: DataTypes.STRING,
                allowNull: true
        },

        infoLink: {
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