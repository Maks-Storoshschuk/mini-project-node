const S3 = require('aws-sdk/clients/s3');
const path = require('path');
const uuid = require('uuid').v1;

const {
    AWS_S3_ACCESS_KEY,
    AWS_S3_NAME,
    AWS_S3_SECRET_KEY,
    AWS_S3_REGION
} = require('../config/config');

const bucket = new S3({
    region: AWS_S3_REGION,
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_KEY
});

module.exports = {
    uploadImage: (file = {}, itemType, itemId) => {
        const {name, data, mimetype} = file;

        const uploadPath = fileNameBuilder(name, itemType, itemId);

        return bucket
            .upload({
                Bucket: AWS_S3_NAME,
                Body: data,
                Key: uploadPath,
                ContentType: mimetype,
                ACL: 'public-read'
            })
            .promise();
    }
};

function fileNameBuilder(fileName, itemType, itemId) {
    const fileExtension = path.extname(fileName);

    return path.join(itemType, itemId, `${uuid()}${fileExtension}`);
}
