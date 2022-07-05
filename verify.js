const timingSafeCompare = require("tsscmp");
const crypto = require("crypto");

// mainly copied from  https://github.com/slackapi/node-slack-sdk/blob/0963851e914dbc0a59d9f80305705bda2d0b9bd8/packages/interactive-messages/src/http-handler.ts#L53-L94

/*** https://github.com/slackapi/node-slack-sdk/blob/0963851e914dbc0a59d9f80305705bda2d0b9bd8/LICENSE

MIT License

Copyright (c) 2014-2020 Slack Technologies, Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ***/

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
