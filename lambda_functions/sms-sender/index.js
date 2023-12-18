const AWS = require("aws-sdk");
const Twilio = require("twilio");
AWS.config.update({ region: "us-east-1" });
exports.sendSms = async function (event) {
  // Create publish parameters
  const smsRequests = event.smsRequests;
  const eventRule = event.eventRule;
  const twilioClient = Twilio(
    process.env.TWILIO_APP_ID,
    process.env.TWILIO_AUTH_TOKEN
  );
  smsRequests.forEach((smsRequest) => {
    twilioClient.messages
      .create({
        body: smsRequest.message,
        from: process.env.TWILIO_FROM_NO,
        to: smsRequest.phoneNo,
      })
      .then(function (sendMessageResponse) {
        console.log("Send SMS Response", sendMessageResponse);
      });
  });
  if (eventRule) {
    const eventBridge = new AWS.EventBridge({ apiVersion: "2015-10-07" });
    await eventBridge
      .removeTargets({
        Rule: eventRule,
        Ids: [eventRule],
      })
      .promise();
    console.log("Targets removed");
    await eventBridge
      .deleteRule({
        Name: eventRule,
      })
      .promise();
    console.log("Rule deleted");
  }
};