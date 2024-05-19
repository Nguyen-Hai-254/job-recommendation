"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLErrorCode = exports.monthMap = exports.applicationType = exports.profession = exports.approvalStatus = exports.positionLevel = exports.experience = exports.employmentType = exports.sex = exports.userRole = exports.degree = void 0;
var degree;
(function (degree) {
    degree["highSchool"] = "Trung h\u1ECDc";
    degree["intermediate"] = "Trung c\u1EA5p";
    degree["associate"] = "Cao \u0111\u1EB3ng";
    degree["bachelor"] = "C\u1EED nh\u00E2n";
    degree["master"] = "Th\u1EA1c s\u0129";
    degree["doctor"] = "Ti\u1EBFn s\u0129";
    degree["Other"] = "Kh\u00E1c";
})(degree || (exports.degree = degree = {}));
var userRole;
(function (userRole) {
    userRole["Employee"] = "EMPLOYEE";
    userRole["Employer"] = "EMPLOYER";
    userRole["Admin"] = "ADMIN";
})(userRole || (exports.userRole = userRole = {}));
var sex;
(function (sex) {
    sex["Male"] = "Nam";
    sex["Female"] = "N\u1EEF";
    sex["Other"] = "Kh\u00E1c";
})(sex || (exports.sex = sex = {}));
///////////////////////////////////////////////////////////////// Jobposting
var employmentType;
(function (employmentType) {
    employmentType["FulltimePermanent"] = "To\u00E0n th\u1EDDi gian c\u1ED1 \u0111\u1ECBnh";
    employmentType["FulltimeTemporary"] = "To\u00E0n th\u1EDDi gian t\u1EA1m th\u1EDDi";
    employmentType["ParttimePermanent"] = "B\u00E1n th\u1EDDi gian c\u1ED1 \u0111\u1ECBnh";
    employmentType["ParttimeTemporary"] = "B\u00E1n th\u1EDDi gian t\u1EA1m th\u1EDDi";
    employmentType["ConsultingContract"] = "Theo h\u1EE3p \u0111\u1ED3ng t\u01B0 v\u1EA5n";
    employmentType["Internship"] = "Th\u1EF1c t\u1EADp";
    employmentType["Other"] = "Kh\u00E1c";
})(employmentType || (exports.employmentType = employmentType = {}));
var experience;
(function (experience) {
    experience["Zero"] = "Ch\u01B0a c\u00F3 kinh nghi\u1EC7m";
    experience["UnderOne"] = "D\u01B0\u1EDBi 1 n\u0103m";
    experience["One"] = "1 n\u0103m";
    experience["Two"] = "2 n\u0103m";
    experience["Three"] = "3 n\u0103m";
    experience["Four"] = "4 n\u0103m";
    experience["Five"] = "5 n\u0103m";
    experience["OverFive"] = "Tr\u00EAn 5 n\u0103m";
})(experience || (exports.experience = experience = {}));
var positionLevel;
(function (positionLevel) {
    positionLevel["ExecutiveManagement"] = "Qu\u1EA3n l\u00ED c\u1EA5p cao";
    positionLevel["MiddleManagement"] = "Qu\u1EA3n l\u00ED c\u1EA5p trung";
    positionLevel["TeamLeader"] = "Qu\u1EA3n l\u00ED nh\u00F3m-gi\u00E1m s\u00E1t";
    positionLevel["Specialist"] = "Chuy\u00EAn gia";
    positionLevel["Employee"] = "Chuy\u00EAn vi\u00EAn - nh\u00E2n vi\u00EAn";
    positionLevel["Contributor"] = "C\u1ED9ng t\u00E1c vi\u00EAn";
})(positionLevel || (exports.positionLevel = positionLevel = {}));
var approvalStatus;
(function (approvalStatus) {
    approvalStatus["approved"] = "\u0110\u00E3 duy\u1EC7t";
    approvalStatus["pending"] = "Ch\u1EDD duy\u1EC7t";
    approvalStatus["rejected"] = "T\u1EEB ch\u1ED1i";
    approvalStatus["expired"] = "H\u1EBFt h\u1EA1n";
})(approvalStatus || (exports.approvalStatus = approvalStatus = {}));
var profession;
(function (profession) {
    profession["01"] = "H\u00E0nh ch\u00EDnh - Th\u01B0 k\u00FD";
    profession["02"] = "Kh\u00E1ch s\u1EA1n - Nh\u00E0 h\u00E0ng - Du l\u1ECBch";
    profession["03"] = "B\u00E1n s\u1EC9 - B\u00E1n l\u1EBB - Qu\u1EA3n l\u00FD c\u1EEDa h\u00E0ng";
    profession["04"] = "Marketing";
    profession["05"] = "B\u00E1n h\u00E0ng - Kinh doanh";
    profession["06"] = "K\u1EBF to\u00E1n";
    profession["07"] = "T\u00E0i ch\u00EDnh - \u0110\u1EA7u t\u01B0 - Ch\u1EE9ng kho\u00E1n";
    profession["08"] = "Ki\u1EC3m to\u00E1n";
    profession["09"] = "Khoa h\u1ECDc - K\u0129 thu\u1EADt";
    profession["010"] = "Ngh\u1EC1 nghi\u1EC7p kh\u00E1c";
    profession["011"] = "An ninh - B\u1EA3o v\u1EC7";
    profession["012"] = "Thi\u1EBFt k\u1EBF - S\u00E1ng t\u1EA1o ngh\u1EC7 thu\u1EADt";
    profession["013"] = "Ki\u1EBFn tr\u00FAc - Thi\u1EBFt k\u1EBF n\u1ED9i ngo\u1EA1i th\u1EA5t";
    profession["014"] = "IT Ph\u1EA7n c\u1EE9ng - M\u1EA1ng";
    profession["015"] = "IT Ph\u1EA7n m\u1EC1m";
    profession["016"] = "S\u1EA3n xu\u1EA5t - L\u1EAFp r\u00E1p - Ch\u1EBF bi\u1EBFn";
    profession["017"] = "N\u00F4ng - L\u00E2m - Ng\u01B0 nghi\u1EC7p";
    profession["018"] = "Thu mua - Kho v\u1EADn - Chu\u1ED7i cung \u1EE9ng";
    profession["019"] = "Xu\u1EA5t nh\u1EADp kh\u1EA9u";
    profession["020"] = "V\u1EADn t\u1EA3i - L\u00E1i xe - Giao nh\u1EADn";
    profession["021"] = "Ng\u00E2n h\u00E0ng";
    profession["022"] = "Khai th\u00E1c n\u0103ng l\u01B0\u1EE3ng - Kho\u00E1ng s\u1EA3n - \u0110\u1ECBa ch\u1EA5t";
    profession["023"] = "Y t\u1EBF - Ch\u0103m s\u00F3c s\u1EE9c kh\u1ECFe";
    profession["024"] = "Nh\u00E2n s\u1EF1";
    profession["025"] = "B\u1EA3o hi\u1EC3m";
    profession["026"] = "Th\u00F4ng tin - Truy\u1EC1n th\u00F4ng - Qu\u1EA3ng c\u00E1o";
    profession["027"] = "Lu\u1EADt - Ph\u00E1p l\u00FD - Tu\u00E2n th\u1EE7";
    profession["028"] = "Qu\u1EA3n l\u00FD d\u1EF1 \u00E1n";
    profession["029"] = "Qu\u1EA3n l\u00FD ti\u00EAu chu\u1EA9n v\u00E0 ch\u1EA5t l\u01B0\u1EE3ng";
    profession["030"] = "B\u1EA5t \u0111\u1ED9ng s\u1EA3n";
    profession["031"] = "Ch\u0103m s\u00F3c kh\u00E1ch h\u00E0ng";
    profession["032"] = "X\u00E2y d\u1EF1ng";
    profession["033"] = "Gi\u00E1o d\u1EE5c - \u0110\u00E0o t\u1EA1o";
    profession["034"] = "Ph\u00E2n t\u00EDch - Th\u1ED1ng k\u00EA d\u1EEF li\u1EC7u";
    profession["035"] = "An to\u00E0n lao \u0111\u1ED9ng";
    profession["036"] = "Bi\u00EAn phi\u00EAn d\u1ECBch";
    profession["037"] = "B\u01B0u ch\u00EDnh vi\u1EC5n th\u00F4ng";
    profession["038"] = "D\u1EA7u kh\u00ED";
    profession["039"] = "D\u1EC7t may - Da gi\u00E0y - Th\u1EDDi trang";
    profession["040"] = "\u0110i\u1EC7n - \u0110i\u1EC7n t\u1EED - \u0110i\u1EC7n l\u1EA1nh";
    profession["041"] = "D\u01B0\u1EE3c ph\u1EA9m";
    profession["042"] = "H\u00F3a h\u1ECDc - H\u00F3a sinh";
    profession["043"] = "M\u00F4i tr\u01B0\u1EDDng - X\u1EED l\u00ED ch\u1EA5t th\u1EA3i";
    profession["044"] = "Th\u1EF1c ph\u1EA9m - \u0110\u1ED3 u\u1ED1ng";
    profession["045"] = "Ch\u0103n nu\u00F4i - Th\u00FA y";
    profession["046"] = "C\u01A1 kh\u00ED - \u00D4 t\u00F4 - T\u1EF1 \u0111\u1ED9ng h\u00F3a";
    profession["047"] = "C\u00F4ng ngh\u1EC7 th\u1EF1c ph\u1EA9m - Dinh d\u01B0\u1EE1ng";
    profession["048"] = "Lao \u0111\u1ED9ng ph\u1ED5 th\u00F4ng";
    profession["049"] = "Phi ch\u00EDnh ph\u1EE7 - Phi l\u1EE3i nhu\u1EADn";
    profession["050"] = "Truy\u1EC1n h\u00ECnh - B\u00E1o ch\u00ED - Bi\u00EAn t\u1EADp";
    profession["051"] = "Xu\u1EA5t b\u1EA3n - In \u1EA5n";
    profession["052"] = "Th\u1EF1c t\u1EADp sinh";
})(profession || (exports.profession = profession = {}));
var applicationType;
(function (applicationType) {
    applicationType["online_profile"] = "N\u1ED9p tr\u1EF1c tuy\u1EBFn";
    applicationType["attached_document"] = "CV \u0111\u00EDnh k\u00E8m";
    applicationType["cv_enclosed"] = "N\u1ED9p nhanh";
})(applicationType || (exports.applicationType = applicationType = {}));
exports.monthMap = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
};
var MySQLErrorCode;
(function (MySQLErrorCode) {
    MySQLErrorCode["DUPLICATE"] = "ER_DUP_ENTRY";
    MySQLErrorCode["INVALID_RELATION_KEY"] = "ER_NO_REFERENCED_ROW";
    MySQLErrorCode["INVALID_RELATION_KEY2"] = "ER_NO_REFERENCED_ROW_2";
    MySQLErrorCode["INVALID_INPUT"] = "ER_TRUNCATED_WRONG_VALUE";
})(MySQLErrorCode || (exports.MySQLErrorCode = MySQLErrorCode = {}));
//# sourceMappingURL=enum.js.map