const regex =
  /Thanks \[@(?:moklick|peterkogo|hayleigh-dot-dev|chrtze|bcakmakoglu)\]\(.*\)! \- */g;

(async () => {
  const body = process.env.BODY;
  const newBody = body.replaceAll(regex, '');
  console.log(newBody);
})();
