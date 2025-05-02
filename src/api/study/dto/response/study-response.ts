import {StudyStatus} from "@/api/study/enum/study-status";
import {StudyType} from "@/api/study/enum/study-type";

export default interface StudyResponse {
    id: number;
    title: string;
    description: string;
    status: StudyStatus;
    type: StudyType;
    participantsCount: number;
    startDate: Date;
    endDate?: Date;
}