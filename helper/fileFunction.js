const fs = require('fs');
const configData = require("../config/config");

module.exports.getJsonData = (fileName) => {
    try {
        let finalData;
        if (fs.existsSync(`${configData.BASE_PATH}/json/${fileName}`)) {
            let rawdata = fs.readFileSync(`${configData.BASE_PATH}/json/${fileName}`);
            finalData = JSON.parse(rawdata);
            return finalData;
        } else {
            let createdFile = fs.writeFileSync(`${configData.BASE_PATH}/json/${fileName}`, '');
            return createdFile;
        }
    } catch (err) {
        return null;
    }
}

module.exports.writeJsonData = (fileName, data) => {
    try {
        let writeFile = fs.writeFileSync(`${configData.BASE_PATH}/json/${fileName}`, JSON.stringify(data));
        return writeFile;
    } catch (err) {
        return null;
    }
}

module.exports.getCoinDetailsJsonData = (fileName) => {
    try {
        let finalData;
        if (fs.existsSync(`${configData.BASE_PATH}/json/${fileName}`)) {
            let rawdata = fs.readFileSync(`${configData.BASE_PATH}/json/${fileName}`);
            finalData = JSON.parse(rawdata);
            return finalData;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}


