const fs = require("fs");
const path = require("path");
const createfolder = require("./createfolder");
const randomString = require("./randomString");

const saveFile = async (pathname, file, prefix) => {
  createfolder(pathname);
  const extension = file.type.split("/")[1];
  const pathnameSplit = pathname.split("/");
  const filePrefix = pathnameSplit[pathnameSplit.length - 1];
  const fileName =
    (prefix || filePrefix) +
    "_" +
    Date.now() +
    `_${randomString(5)}` +
    "." +
    extension;
  const uploadPath = path.join(
    process.cwd(),
    "public",
    pathname,
    `${fileName}`
  );
  const buffer = Buffer.from(await file.arrayBuffer());

  fs.writeFile(uploadPath, buffer, (err) => {
    if (err) {
      return false;
    }
  });  
  return  fileName;
};

module.exports = saveFile;
