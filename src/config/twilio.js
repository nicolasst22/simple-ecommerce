const SID = "AC28e8a5ddf84a9993256cf60abba4387f";
const authToken = "3d914c98283a9810df6c75e541beba77"
const myNumber = "+12055572689";
const myWhatsapp = "+14155238886";

const twilio = require("twilio")(SID, authToken, { lazyLoading: true });

module.exports = {
    twilio,
    myNumber,
    myWhatsapp
};