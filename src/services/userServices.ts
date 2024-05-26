import moment from "moment"
import { myDataSource } from "../config/connectDB"
import { User, Employee, Employer, OnlineProfile, AttachedDocument } from "../entities"
import { sex } from "../utils/enum"
import { HttpException } from "../exceptions/httpException"

const userRepository = myDataSource.getRepository(User);
const employerRepository = myDataSource.getRepository(Employer);
const employeeRepository = myDataSource.getRepository(Employee);
const online_profileRepository = myDataSource.getRepository(OnlineProfile);
const attached_documentRepository = myDataSource.getRepository(AttachedDocument);

export default class UserServices {
    static handleGetProfile = async (user) => {
        const getUserProfile = await userRepository.findOne({
            where: { userId: user.userId },
            relations: ['employee']
        })

        if (!getUserProfile) throw new HttpException(404, `This account isn't registered`);

        return  {
                userId: getUserProfile.userId,
                email: getUserProfile.email,
                name: getUserProfile.name,
                role: getUserProfile.role,
                dob: moment(getUserProfile.dob).format("DD-MM-YYYY"),
                address: getUserProfile.address,
                phone: getUserProfile.phone,
                sex: getUserProfile.sex,
                avatar: getUserProfile.avatar,
                isMarried: getUserProfile.employee?.isMarried ? getUserProfile.employee.isMarried : null
            }
    }

    static handleEditProfile = async (user, body) => {
        let findUser = await userRepository.findOne({
            where: { userId: user.userId },
            relations: ['employee']
        })

        if (!findUser) throw new HttpException(404, `This account isn't registered`);


        findUser.name = body.name ? body.name : null;
        findUser.dob = new Date(moment(body.dob, "DD-MM-YYYY").format("MM-DD-YYYY"));
        findUser.address = body.address ? body.address : null;
        findUser.phone = body.phone ? body.phone : null;

        if (body.sex == 1) {
            findUser.sex = sex.Male
        }
        else if (body.sex == 2) {
            findUser.sex = sex.Female
        }
        else {
            findUser.sex = sex.Other
        }

        if (findUser.employee) {
            findUser.employee.isMarried = body.isMarried === '1' ? true : false;
            await employeeRepository.save(findUser.employee);
        }

        await userRepository.save(findUser);

        return  {
                userId: findUser.userId,
                email: findUser.email,
                name: findUser.name,
                dob: moment(findUser.dob).format("DD-MM-YYYY"),
                address: findUser.address,
                phone: findUser.phone,
                sex: findUser.sex,
                isMarried: findUser.employee?.isMarried ? findUser.employee.isMarried : null
            }
    }

    static handleGetInformationCompany = async (user) => {
        const getEmployer = await userRepository.findOne({
            where: { userId: user.userId },
            relations: ['employer']
        })

        if (!getEmployer) throw new HttpException(404, `user not found`);

        return  {
                userId: getEmployer.userId,
                email: getEmployer.email,
                name: getEmployer.name,
                role: getEmployer.role,
                taxCode: getEmployer.employer.taxCode,
                companyName: getEmployer.employer.companyName,
                companyLocation: getEmployer.employer.companyLocation,
                careerField: getEmployer.employer.careerField,
                logo: getEmployer.employer.logo,
                banner: getEmployer.employer.banner,
                description: getEmployer.employer.description
            }
    }

    static handleEditInformationCompany = async (user, body) => {
        let findEmployer = await userRepository.findOne({
            where: { userId: user.userId },
            relations: ['employer']
        })

        if (!findEmployer) throw new HttpException(404, `user not found`);


        if (body.taxCode) findEmployer.employer.taxCode = body.taxCode;
        if (body.companyName) findEmployer.employer.companyName = body.companyName;
        if(body.companyLocation) findEmployer.employer.companyLocation = body.companyLocation;
        if (body.careerField) findEmployer.employer.careerField = body.careerField;
        if (body.description) findEmployer.employer.description = body.description;

        await employerRepository.save(findEmployer.employer);

        return  {
                userId: findEmployer.userId,
                email: findEmployer.email,
                name: findEmployer.name,
                role: findEmployer.role,
                taxCode: findEmployer.employer.taxCode,
                companyName: findEmployer.employer.companyName,
                companyLocation: findEmployer.employer.companyLocation,
                careerField: findEmployer.employer.careerField,
                description: findEmployer.employer.description
            }
    }

    static handleUploadAvatar = async (user, avatar) => {
        let findUser = await userRepository.findOne({
            where: { userId: user.userId }
        })

        if (!findUser) throw new HttpException(404, `user not found`);

        findUser.avatar = avatar;
        await userRepository.save(findUser);

        return {
                userId: findUser.userId,
                email: findUser.email,
                avatar: findUser.avatar,
                role: findUser.role
            }
    }

    static handleUploadLogo = async (user, logo) => {
        let findEmployer = await employerRepository.findOne({
            where: { userId: user.userId }
        })

        if (!findEmployer) throw new HttpException(404, `user not found`);


        findEmployer.logo = logo;
        await employerRepository.save(findEmployer);
      
        return  {
                userId: findEmployer.userId,
                companyName: findEmployer.companyName,
                avatar: findEmployer.logo
            }
    }

    static handleUploadBanner = async (user, banner) => {
        let findEmployer = await employerRepository.findOne({
            where: { userId: user.userId }
        })

        if (!findEmployer) throw new HttpException(404, `user not found`);

        findEmployer.banner = banner;
        await employerRepository.save(findEmployer);
      
        return  {
                userId: findEmployer.userId,
                companyName: findEmployer.companyName,
                banner: findEmployer.banner
            }
    }

    static handleGetInformationCompanyByUser = async (id) => {
        const getEmployer = await userRepository
            .createQueryBuilder('user')
            .select(['user'])
            .leftJoinAndSelect('user.employer', 'employer')
            .where('user.userId = :id', {id})
            .getOne();

        if (!getEmployer) throw new HttpException(404, `company not found`);

        return  {
                userId: getEmployer.userId,
                email: getEmployer.email,
                name: getEmployer.name,
                role: getEmployer.role,
                taxCode: getEmployer.employer.taxCode,
                companyName: getEmployer.employer.companyName,
                companyLocation: getEmployer.employer.companyLocation,
                careerField: getEmployer.employer.careerField,
                logo: getEmployer.employer.logo,
                banner: getEmployer.employer.banner,
                description: getEmployer.employer.description,
            }
    }

    static handleGetAllCompanyByUser = async (reqQuery) => {
        const { num, page } = reqQuery;
    
        let query = employerRepository.createQueryBuilder('company')
        // Pagination
        query = query.skip((Number(page)-1) * Number(num)).take(Number(num));

        const [items, totalItems] = await query.getManyAndCount();
        const totalPages = Math.ceil(totalItems / num);
  
        return  {
            items: items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: num,
                totalPages,
                currentPage: page
            }
        }
 
    }

    static handleDeleteUser = async (id) => {
        const user = await userRepository.findOneBy({ userId: id });
        if (!user) throw new HttpException(404, "User not found");

        await userRepository.remove(user);
        return user;

    }

    static handleGetOnlineProfileByUser = async (userId) => {
        const online_profile = await online_profileRepository.findOne({
            where: { employee: { userId: userId }, isHidden: false},
            relations: ['employee.user', 'another_degrees', 'education_informations', 'work_experiences']
        })
        if (!online_profile) throw new HttpException(404, "Online profile not found");

        await online_profileRepository.createQueryBuilder('onl')
            .update()
            .set({
                view: () => "view + 1"
            })
            .execute()

        let data = {
            email: online_profile.employee.user.email,
            name: online_profile.employee.user.name,
            dob: online_profile.employee.user.dob,
            address: online_profile.employee.user.address,
            phone: online_profile.employee.user.phone,
            sex: online_profile.employee.user.sex,
            avatar: online_profile.employee.user.avatar,
            isMarried: online_profile.employee.isMarried,
            ...online_profile
        };

        let { employee, ...newData } = data

        return newData;
    }

    static handleGetAttachedDocumentByUser = async (userId) => {
        const attached_document = await attached_documentRepository.findOne({
            where: { employee: { userId: userId }, isHidden: false },
            relations: ['employee.user']
        })

        if (!attached_document) throw new HttpException(404, "Attached document not found");

        await attached_documentRepository.createQueryBuilder('att')
            .update()
            .set({
                view: () => "view + 1"
            })
            .execute()

        let data = {
            email: attached_document.employee.user.email,
            name: attached_document.employee.user.name,
            dob: attached_document.employee.user.dob,
            address: attached_document.employee.user.address,
            phone: attached_document.employee.user.phone,
            sex: attached_document.employee.user.sex,
            avatar: attached_document.employee.user.avatar,
            isMarried: attached_document.employee.isMarried,
            ...attached_document
        };

        let { employee, ...newData } = data

        return newData;
    }
    static getUserIdByEmail = async (email) => {
        const findUser = await userRepository.findOneBy({ email: email });
        if (!findUser) {
           throw new HttpException(404, 'User not found');
        }
        return findUser.userId;
    }
}