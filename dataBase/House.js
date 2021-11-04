const {Schema, model} = require('mongoose');

const houseSchema = new Schema({
    country: {
        type: String,
        trim: true,
        required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    region: {
        type: String,
        trim: true,
        required: true
    },
    volume: {
        type: Number,
        trim: true,
        required: true,
    },
    person: {
        type: Number,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        max: 200,
        min: 20,
    },
    pic: {
        type: String
    },
    is_actual: {
        type: Boolean,
        default: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    payment: {
        type: Number,
    },
    from: {
        type: Date,
    },
    to: {
        type: Date,
    },
    for_rent: {
        type: Boolean
    },
    comment: {
        type: String,
    }
}, {timestamps: true, toObject: {virtuals: true}, toJSON: {virtuals: true}});

houseSchema.methods = {
    houseNormalizer(houseToNormalize) {
        const object = houseToNormalize.toObject();

        if (object.is_actual) {
            const fieldsToRemove = [
                'is_actual',
                '__v',
                'payment',
                'to',
                'for_rent',
                'from'
            ];

            fieldsToRemove.forEach((field) => {
                delete object[field];
            });
            return object;
        }
    }
};

module.exports = model('house', houseSchema);
