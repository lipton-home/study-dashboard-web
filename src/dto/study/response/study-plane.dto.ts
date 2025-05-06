import UserDto from "@/dto/user/response/user.dto";

export default interface StudyPlaneDto {
    id: number;
    title: string;
    description: string;
    managers: UserDto[]
    startDate: string;
    endDate?: string;
}