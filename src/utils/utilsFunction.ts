import nodemailer from "nodemailer"

export const countCandidatesbyProfession = (professionCountList) => {
    // Mảng các nghề nghiệp (có giá trị trùng lặp)
    const professionsList = professionCountList.map(item => item.profession.split(', ')).flat();
    // Tạo mảng mới bỏ các giá trị trùng lặp
    const uniqueProfessions = [...new Set(professionsList)];
    // Tạo một đối tượng để đếm số lượng của từng nghề nghiệp. countMap = {nghề: count, ...}
    const countMap = {};

    professionCountList.forEach(item => {
        uniqueProfessions.forEach(profession => {
            if (typeof profession === 'string' && item.profession.includes(profession)) {
                countMap[profession] = (countMap[profession] || 0) + parseInt(item.userCount);
            }
        });
    })

    return countMap;
}

export const mergerTwoObject = (obj1, obj2) => {
    let result = { ...obj1 };
    for (let key in obj2) {
        if (result[key])
            result[key] += obj2[key]
        else
            result[key] = obj2[key]
    }

    return result
}

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const createArrayForDate = (month, year) => {
    if (month === "1" || month === "3" || month === "5" || month === "7" || month === "8" || month === "10" || month === "12")
        return Array.from({ length: 31 }, (_, i) => ({ time: i + 1, value: '0' }));
    else if (month === "4" || month === "6" || month === "9" || month === "11")
        return Array.from({ length: 30 }, (_, i) => ({ time: i + 1, value: '0' }));
    else if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0))
        return Array.from({ length: 29 }, (_, i) => ({ time: i + 1, value: '0' }));
    else
        return Array.from({ length: 28 }, (_, i) => ({ time: i + 1, value: '0' }));
}