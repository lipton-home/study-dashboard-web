import UpdateStudyRequest from "@/api/study/dto/request/update-study-request";
import StudyResponse from "./dto/response/study-response";
import axios from "@/lib/axios";

export default async function updateStudy(args: {
    dto: UpdateStudyRequest,
    id: number
}): Promise<StudyResponse> {
    const {id, dto} = args;
    return axios.patch(`/studies/${id}`, dto).then(
        (res): StudyResponse => {
            return res.data;
        }
    )
}