'use strict';
const bcrypt = require('bcryptjs')
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    toSafeObject () {
      const {id, firstName, lastName, username, email} = this;
      return {id, firstName, lastName, username, email}
    }
    static associate(models) {
     User.hasMany(models.Spot, {foreignKey: 'ownerId'})
     User.hasMany(models.Booking, {foreignKey: 'userId'})
     User.hasMany(models.Review, {foreignKey: 'userId'})

    }
    // get user
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    };
    // login
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }
    // signup
    static async signup({ username, email, firstName, lastName, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        firstName,
        lastName,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    }
  }

  User.init({
    username:
    {type: DataTypes.STRING,
      allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
    firstName: {
      type: DataTypes.STRING,
      // allowNull: false
      },
    lastName: {
      type: DataTypes.STRING,
      // allowNull: false
      },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ["hashedPassword", "createdAt", 'updatedAt']}
      },
      loginUser: {
        attributes: {}
      }
    }
  });
  return User;
};
