const userDao = require('../db/users/user-dao');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });

module.exports = (app) => {
    const findAllUsers = (req, res) =>
        userDao.findAllUsers()
            .then(users => res.json(users));

    const findUserById = (req, res) =>
        userDao.findUserById(req.params.userId)
            .then(user => res.json(user));

    const deleteUser = (req, res) =>
        userDao.deleteUser(req.params.userId)
            .then(status => res.send(status));

    const updateUser = (req, res) =>
        userDao.updateUser(req.body)
            .then(status => res.send(status));

    const updateProfilePic = (req, res) => {
        const id = req.body.userId;
        const profilePic = req.file.path;
        const user = {
            _id: id,
            profilePic
        }
        userDao.updateUser(user)
            .then(updatedUser => res.send(updatedUser));
    }
    app.put('/api/users/profile', upload.single('profilePic'), updateProfilePic);

    const updateHeaderPic = (req, res) => {
        const id = req.body.userId;
        const headerPic = req.file.path;
        const user = {
            _id: id,
            headerPic
        }
        userDao.updateUser(user)
            .then(status => res.send(status));
    }
    app.put('/api/users/header', upload.single('headerPic'), updateHeaderPic);

    const login = (req, res) => {
        userDao.findByEmailAndPassword(req.body)
            .then(user => {
                if(user) {
                    req.session['user'] = user;
                    res.json(user);
                    return;
                }
                res.sendStatus(403);
            })
    }

    const register = (req, res) => {
        userDao.findByEmail(req.body)
            .then(user => {
                if(user) {
                    res.sendStatus(404);
                    return;
                }
                userDao.createUser(req.body)
                    .then(user => {
                        req.session['user'] = user;
                        res.json(user)
                    });
            })
    }

    const user = (req, res) =>
        res.json(req.session['user']);

    const logout = (req, res) =>
        res.send(req.session.destroy());

    app.post('/api/login', login);
    app.post('/api/register', register);
    app.post('/api/user', user);
    app.post('/api/logout', logout);
    app.put('/api/users', updateUser);
    app.delete('/api/users/:userId', deleteUser);
    app.get('/api/users', findAllUsers);
    app.get('/api/users/:userId', findUserById);
};