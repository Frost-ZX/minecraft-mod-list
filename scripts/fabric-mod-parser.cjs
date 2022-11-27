const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const CURR_DIR = __dirname;
const INPUT_DIR = path.join(CURR_DIR, 'inputs');
const OUTPUT_FILE = path.join(CURR_DIR, 'outputs/result.json');

/**
 * @description 获取日期字符串
 * @param {Date} date 日期对象
 */
function getDateString(date) {

  if (!(date instanceof Date)) {
    return '';
  }

  const y = String(date.getFullYear());
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`

}

(function () {

  console.clear();

  const fileList = fs.readdirSync(INPUT_DIR);
  const result = [];
  const regExp = /.(jar|zip)$/;

  fileList.forEach((fileName) => {

    // 跳过非模组文件
    if (!regExp.test(fileName)) {
      return;
    }

    const zipPath = path.join(INPUT_DIR, fileName);
    const zipItem = new AdmZip(zipPath);
    const jsonEntry = zipItem.getEntry('fabric.mod.json');

    if (!jsonEntry) {
      console.warn(`文件 ${fileName} 中未找到模组信息，跳过。`);
      return;
    }

    let infoContent = zipItem.readAsText(jsonEntry);
    let infoJSON = null;

    try {
      if (infoContent) {
        infoJSON = JSON.parse(infoContent);
      } else {
        console.error(`读取 ${fileName} 的模组信息失败。`);
        return;
      }
    } catch (error) {
      console.error(`解析 ${fileName} 的模组信息失败：`);
      console.error(error);
      return;
    }

    const contact = infoJSON.contact;
    const data = {
      authors: infoJSON.authors,
      description: infoJSON.description,
      file: fileName,
      id: infoJSON.id,
      license: infoJSON.license,
      names: [infoJSON.name],
      update: getDateString(jsonEntry.header.time),
      version: infoJSON.version,
    };

    // 解析链接
    if (contact && contact.constructor === Object) {
      let links = [];
      for (let key in contact) {
        links.push(contact[key]);
      }
      data.links = links;
    }

    result.push(data);

  });

  const outputData = JSON.stringify(result, null, 2);

  fs.writeFile(OUTPUT_FILE, outputData, {
    encoding: 'utf-8',
    flag: 'w',
  }, function (err) {
    if (err) {
      console.error('写入结果到文件失败：');
      console.error(err);
    } else {
      console.info('操作已完成！');
    }
  });

})();
