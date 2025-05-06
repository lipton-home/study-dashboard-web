import {StudyStatus} from "@/dto/study/enum/study-status";
import {StudyType} from "@/dto/study/enum/study-type";

export default interface StudyDto {
    id: number;
    title: string;
    description: string;
    status: StudyStatus;
    type: StudyType;
    participantsCount: number;
    startDate: string;
    endDate?: string;
}