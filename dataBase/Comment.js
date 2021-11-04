const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    comment: {
        type: String,
    },
    house_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'house',
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    
}, {timestamps: true, toObject: {virtuals: true}, toJSON: {virtuals: true}});

commentSchema.methods = {
    commentNormalizer(comments) {
        const object = comments.toObject();
        const fieldsToRemove = [
            '_id',
            '__v',
        ];

        fieldsToRemove.forEach((field) => {
            delete object[field];
        });

        return object;
    }
};
module.exports = model('comment', commentSchema);
