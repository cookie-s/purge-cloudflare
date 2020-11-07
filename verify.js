const timingSafeCompare = require("tsscmp");
const crypto = require("crypto");

// mainly copied from  https://github.com/slackapi/node-slack-sdk/blob/0963851e914dbc0a59d9f80305705bda2d0b9bd8/packages/interactive-messages/src/http-handler.ts#L53-L94
exports.verifyRequestSignature = (signingSecret, requestHeaders, body) => {
  const debug = require("debug")("verifyRequestSignature");

  if (!(signingSecret && requestHeaders && body)) {
    debug("lack parameters");
    throw new Error("lack parameters");
  }

  // Request signature
  const signature = requestHeaders["x-slack-signature"];
  // Request timestamp
  const ts = parseInt(requestHeaders["x-slack-request-timestamp"], 10);

  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;

  if (ts < fiveMinutesAgo) {
    debug("request is older than 5 minutes");
    throw new Error("Slack request signing verification outdated");
  }

  const hmac = crypto.createHmac("sha256", signingSecret);
  const [version, hash] = signature.split("=");
  hmac.update(`${version}:${ts}:${body}`);

  if (!timingSafeCompare(hash, hmac.digest("hex"))) {
    debug("request signature is not valid");
    throw new Error("Slack request signing verification failed");
  }

  debug("request signing verification success");
  return true;
};
