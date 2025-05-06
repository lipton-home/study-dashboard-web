import StudyDto from "@/dto/study/response/study.dto";
import axios from "@/lib/axios";
import CreateStudyDto from "@/dto/study/request/create-study.dto";
import UpdateStudyDto from "@/dto/study/request/update-study.dto";
import StudyPlaneDto from "@/dto/study/response/study-plane.dto";
import {Pagination} from "@/dto/pagination";
import StudyPlanDto from "@/dto/study/response/study-plan.dto";
import { StudyPlanStatus } from "@/dto/study/enum/study-plan-status";

export async function createStudy(dto: CreateStudyDto): Promise<StudyDto> {
    return axios.post('/api/studies', dto)
        .then((res): StudyDto => {
            return res.data;
        })
}

export async function deleteStudy(id: number): Promise<StudyDto> {
    return axios.delete(`/api/studies/${id}`)
        .then((res): StudyDto => {
            return res.data;
        })
}

export async function getStudies(page: number = 0): Promise<Pagination<StudyDto>> {
    return axios.get('/api/studies', {
        params: {
            page
        }
    })
        .then((res): Pagination<StudyDto> => {
            return res.data;
        })
}

export async function getStudy(id: number): Promise<StudyDto> {
    return axios.get(`/api/studies/${id}`)
        .then((res): StudyDto => {
            return res.data
        })
}

export async function updateStudy(args: {
    dto: UpdateStudyDto,
    id: number
}): Promise<StudyDto> {
    const {id, dto} = args;
    return axios.patch(`/api/studies/${id}`, dto).then(
        (res): StudyDto => {
            return res.data;
        }
    )
}

export async function getStudyPlans(id: number): Promise<StudyPlanDto[]> {
    return axios.get(`/api/studies/${id}/plans`).then(
        (res): StudyPlanDto[] => {
            return res.data.map((plan: any) => ({
                ...plan,
                startDate: new Date(plan.startDate),
                endDate: new Date(plan.endDate)
            }));
        }
    )
}

export interface CreateStudyPlanDto {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: StudyPlanStatus;
}

export interface UpdateStudyPlanDto extends CreateStudyPlanDto {}

export const createStudyPlan = async (studyId: number, dto: CreateStudyPlanDto): Promise<StudyPlanDto> => {
    const requestDto = {
        ...dto,
        startDate: dto.startDate.toISOString().split('T')[0],
        endDate: dto.endDate.toISOString().split('T')[0]
    };
    return axios.post(`/api/studies/${studyId}/plans`, requestDto)
        .then((res): StudyPlanDto => {
            const data = res.data;
            return {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            };
        });
};

export const updateStudyPlan = async (studyId: number, planId: number, dto: UpdateStudyPlanDto): Promise<StudyPlanDto> => {
    const requestDto = {
        ...dto,
        startDate: dto.startDate.toISOString().split('T')[0],
        endDate: dto.endDate.toISOString().split('T')[0]
    };
    return axios.patch(`/api/studies/${studyId}/plans/${planId}`, requestDto)
        .then((res): StudyPlanDto => {
            const data = res.data;
            return {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            };
        });
};

export const deleteStudyPlan = async (studyId: number, planId: number): Promise<StudyPlanDto> => {
    return axios.delete(`/api/studies/${studyId}/plans/${planId}`)
        .then((res): StudyPlanDto => {
            const data = res.data;
            return {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            };
        });
};

export interface UpdateStudyPlanStatusDto {
    status: StudyPlanStatus;
}

export const updateStudyPlanStatus = async (studyId: number, planId: number, status: StudyPlanStatus): Promise<StudyPlanDto> => {
    return axios.patch(`/api/studies/${studyId}/plans/${planId}/status`, { status })
        .then((res): StudyPlanDto => {
            const data = res.data;
            console.log(data)
            return {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            };
        });
};

export interface InviteStudyUsersDto {
    emails: string[];
}

export const inviteUsersToStudy = async (studyId: number, dto: InviteStudyUsersDto): Promise<any> => {
    return axios.post(`/api/studies/${studyId}/invites`, dto)
        .then((res) => res.data);
};

export interface StudyInviteDto {
    userId: number;
    studyId: number;
    studyTitle: string;
}

export const getStudyInvites = async (): Promise<StudyInviteDto[]> => {
    return axios.get('/api/studies/invites')
        .then((res) => res.data);
};