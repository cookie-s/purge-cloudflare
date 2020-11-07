const {
  SLACK_SIGNING_SECRET,
  CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ZONE_ID,
} = process.env;

const cf = require("cloudflare")({ token: CLOUDFLARE_API_TOKEN });

const { verifyRequestSignature } = require("./verify");

exports.purgeAll = async (req, res) => {
  try {
    const debug = require("debug")("purgeAll");
    const rawBody = req.rawBody;

    try {
      if (!verifyRequestSignature(SLACK_SIGNING_SECRET, req.headers, rawBody))
        throw new Error("request signing verification failed");
    } catch (e) {
      console.log(e);
      return res.status(403).send("ng");
    }

    const purgeRes = await cf.zones.purgeCache(CLOUDFLARE_ZONE_ID, {
      purge_everything: true,
    });
    debug(purgeRes);

    return res.status(200).send(purgeRes);
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};
