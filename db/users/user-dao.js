const userModel = require('./user-model');

const findAllUsers = () =>
    userModel.find();

const findUserById = (userId) =>
    userModel.findById(userId);

const findByEmailAndPassword = ({email, password}) =>
    userModel.findOne({email, password});

const findByEmail = ({email}) =>
    userModel.findOne({email});

const createUser = (user) =>
    userModel.create(user);

const updateUser = (user) =>
    userModel.findOneAndUpdate({_id: user._id}, {
        $set: user
    }, {
        new: true
    });

const deleteUser = (userId) =>
    userModel.deleteOne({_id: userId});

module.exports = {
    findByEmail, findAllUsers, findUserById,
    findByEmailAndPassword,
    createUser, updateUser, deleteUser
};