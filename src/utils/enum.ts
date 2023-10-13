export enum degree {
    highSchool = 'Trung học',
    intermediate = 'Trung cấp',
    associate = 'Cao đẳng',
    bachelor = 'Cử nhân',
    master = 'Thạc sĩ',
    doctor = 'Tiến sĩ',
    Other = 'Khác'
}

export enum userRole {
    Employee = 'EMPLOYEE',
    Employer = 'EMPLOYER',
    Admin = 'ADMIN'
}

export enum sex {
    Male = 'Nam',
    Female = 'Nữ',
    Other = 'Khác'
}

///////////////////////////////////////////////////////////////// Jobposting
export enum employmentType {
    FulltimePermanent = 'Toàn thời gian cố định',
    FulltimeTemporary = 'Toàn thời gian tạm thời',
    ParttimePermanent = 'Bán thời gian cố định',
    ParttimeTemporary = 'Bán thời gian tạm thời',
    ConsultingContract = 'Theo hợp đồng tư vấn',
    Internship = 'Thực tập',
    Other = 'Khác'
}

export enum experience {
    Zero = 'Chưa có kinh nghiệm',
    UnderOne = 'Dưới 1 năm',
    One = '1 năm',
    Two = '2 năm',
    Three = '3 năm',
    Four = '4 năm',
    Five = '5 năm',
    OverFive = 'Trên 5 năm'
}

export enum positionLevel {
    ExecutiveManagement = 'Quản lí cấp cao',
    MiddleManagement = 'Quản lí cấp trung',
    TeamLeader = 'Quản lí nhóm-giám sát',
    Specialist = 'Chuyên gia',
    Employee = 'Chuyên viên - nhân viên',
    Contributor = 'Cộng tác viên'
}

export enum postStatus {
    approved = 'Đã duyệt',
    pendingApproval = 'Chờ duyệt',
    rejected = 'Từ chối',
    expired = 'Hết hạn'
}

