const EmailTemplate = require('email-templates');
const nodemailer = require('nodemailer');
const path = require('path');

const allTemplates = require('../emails');
const {ErrorBuilder, Errors} = require('../errorHandler');
const {NO_REPLY_EMAIL, NO_REPLY_EMAIL_PASSWORD} = require('../config/config');

const templateParser = new EmailTemplate({
    view: {
        root: path.join(process.cwd(), 'emails')
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NO_REPLY_EMAIL,
        pass: NO_REPLY_EMAIL_PASSWORD
    }
});

const sendMail = async (userMail, emailAction, context = {}) => {
    const templateInfo = allTemplates[emailAction];

    if (!templateInfo) {
        ErrorBuilder(Errors.err409WT);
    }

    const html = await templateParser.render(templateInfo.templateName, context);

    return transporter.sendMail({
        from: 'Na reply',
        to: userMail,
        subject: templateInfo.subject,
        html
    });
};

module.exports = {
    sendMail
};
