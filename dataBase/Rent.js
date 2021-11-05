const {Schema, model} = require('mongoose');

const rentSchema = new Schema({
    agree_token: {
        type: String,
        required: true,
        trim: true,
    },
    refuse_token: {
        type: String,
        required: true,
        trim: true,
    },
    house_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'house',
    },
    tenant_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    tenant: {
        type: String,
        required: true,
        trim: true,
    },
}, {timestamps: true, toObject: {virtuals: true}, toJSON: {virtuals: true}});

rentSchema.pre('findOne', function() {
    this.populate('house_id');
});


module.exports = model('Rent', rentSchema);
