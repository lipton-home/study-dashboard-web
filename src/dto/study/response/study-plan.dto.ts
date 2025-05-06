import { StudyPlanStatus } from "../enum/study-plan-status";

export default interface StudyPlanDto {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: StudyPlanStatus;
} 