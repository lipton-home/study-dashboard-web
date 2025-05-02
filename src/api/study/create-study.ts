import StudyResponse from "@/api/study/dto/response/study-response";
import axios from "@/lib/axios";
import CreateStudyRequest from "@/api/study/dto/request/create-study-request";

export default async function createStudy(dto: CreateStudyRequest): Promise<StudyResponse> {
    return axios.post('/studies', dto)
        .then((res): StudyResponse => {
            return res.data;
        })
}