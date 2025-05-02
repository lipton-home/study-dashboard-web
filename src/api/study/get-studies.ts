import axios from "@/lib/axios";
import StudyResponse from "@/api/study/dto/response/study-response";

export default async function getStudies(): Promise<StudyResponse[]> {
    return axios.get('/studies')
        .then((res): StudyResponse[] => {
            return res.data;
        })
}