import StudyResponse from "@/api/study/dto/response/study-response";
import axios from "@/lib/axios";

export default async function deleteStudy(id: number): Promise<StudyResponse> {
    return axios.delete(`studies/${id}`)
        .then((res): StudyResponse => {
            return res.data;
        })
}