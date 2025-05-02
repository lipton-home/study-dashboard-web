import {StudyStatus} from "@/api/study/enum/study-status";
import {StudyType} from "@/api/study/enum/study-type";

export default interface CreateStudyRequest {
    title: string;
    description: string;
    status: StudyStatus;
    type: StudyType;
    participantCount: number;
    startDate: Date;
    endDate?: Date;
}