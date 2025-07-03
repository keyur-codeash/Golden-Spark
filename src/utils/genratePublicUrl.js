const genratePublicUrl = (pathname, file) => {
  const url = process.env.SERVER_URL + "/" + pathname + "/" + file;
  return url;
};

module.exports = genratePublicUrl;
