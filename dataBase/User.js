const {Schema, model} = require('mongoose');

const {constants} = require('../config');
const passwordService = require('../services/password.service');

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    number: {
        type: Number,
        trim: true,
        unique: true,
    },
    role: {
        type: String,
        default: constants.USER,
        enum: [
            constants.USER,
            constants.ADMIN,
            constants.MANAGER,
        ]
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: false,
        required: true
    },
    avatar: {
        type:String
    }
}, {timestamps: true, toObject: {virtuals: true}, toJSON: {virtuals: true}});

userSchema.methods = {
    comparePassword(password) {
        return passwordService.compare(password, this.password);
    },

    userNormalizer(userToNormalize) {
        const object = userToNormalize.toObject();
        const fieldsToRemove = [
            'password',
            '__v'
        ];

        fieldsToRemove.forEach((field) => {
            delete object[field];
        });

        return object;
    }
};

userSchema.statics = {
    async createUserWithHashPassword(userObject) {
        const hashedPassword = await passwordService.hash(userObject.password);

        return this.create({...userObject, password: hashedPassword});

    }
};

module.exports = model('user', userSchema);
