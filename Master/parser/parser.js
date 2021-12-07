var fs = require('fs');

module.exports = function (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', async function (err, data) {
      if (err) throw err;
      let obj = [];
      let splitted = data.toString().split('\n');
      let tmp = {};
      for (let i = 0; i < splitted.length; i++) {
        let splitLine = splitted[i].split(':');
        if (splitLine[1] !== undefined && splitLine[0] !== '\r') {
          splitLine[1] = splitLine[1].trim();
          tmp[splitLine[0]] = splitLine[1].split(',');
          if (tmp.Stars) {
            tmp.Stars = await parse(tmp);
          }
        } else {
          if (Object.keys(tmp).length !== 0) obj.push(tmp);
          tmp = {};
        }
      }
      resolve(obj);
    });
  });
};

async function parse(tmp) {
  return new Promise((resolve, reject) => {
    tmp = tmp.Stars.map((element) => {
      element = element.trim();
      return element;
    });
    resolve(tmp);
  });
}
