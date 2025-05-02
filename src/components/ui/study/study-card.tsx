import {ReactElement} from "react";
import {Card} from "@/components/ui/card";
import StudyResponse from "@/api/study/dto/response/study-response";

export default function StudyCard(props: {study: StudyResponse}): ReactElement{
    return (
        <Card className="p-4 space-y-2 shadow-md hover:shadow-lg transition-shadow rounded-lg">
            <h2 className="text-lg font-semibold">{props.study.title}</h2>
            <div className="flex items-center space-x-2">
                <span
                    className={`px-2 py-0.5 rounded text-white text-xs ${
                        props.study.status === 'PENDING'
                            ? 'bg-red-500'
                            : props.study.status === 'IN_PROGRESS'
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                    }`}
                >
                    {props.study.status.toLowerCase()}
                </span>
                <span
                    className={`px-2 py-0.5 rounded text-white text-xs ${
                        props.study.type === 'PROJECT' ? 'bg-yellow-500' : 'bg-amber-800'
                    }`}
                >
                    {props.study.type.toLowerCase()}
                </span>
            </div>
            <p className="text-sm text-gray-600">{props.study.description}</p>
            <p className="text-sm text-gray-600 mb-1">참여 인원: {props.study.participantsCount}</p>
            <p className="text-sm text-gray-600">
                기간: {props.study.startDate.toDateString()} ~ {props.study.endDate ? props.study.endDate.toDateString() : '미정'}
            </p>
        </Card>
    );
}