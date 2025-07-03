const fs = require("fs");

const createfolder = (path) => {
  if (!fs.existsSync(`public/${path}/`)) {
    fs.mkdirSync(`public/${path}/`, { recursive: true });
  }
};

module.exports = createfolder;
