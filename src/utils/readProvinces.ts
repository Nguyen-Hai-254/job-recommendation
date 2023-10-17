import fs from "fs";

export const readProvinces = () => {
    try {
        let readData = fs.readFileSync('src/constant/provinces.json', 'utf8');
        let data = JSON.parse(readData);
        return data;
    } catch (e) {
        console.log(e)
    }
}

export const readProfession = () => {
    try {
        let readData = fs.readFileSync('src/constant/profession.json', 'utf8');
        return JSON.parse(readData);
    } catch (e) {
        console.log(e)
    }
}