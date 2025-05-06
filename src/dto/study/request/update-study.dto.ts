import {StudyStatus} from "@/dto/study/enum/study-status";
import {StudyType} from "@/dto/study/enum/study-type";

export default interface UpdateStudyDto {
    title?: string;
    description?: string;
    status?: StudyStatus;
    type?: StudyType;
    participantCount?: number;
    startDate?: Date;
    endDate?: Date;
}