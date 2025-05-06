import {ReactElement} from "react";
import {Card, CardDescription, CardTitle} from "@/components/ui/card";
import StudyDto from "@/dto/study/response/study.dto";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {deleteStudy} from "@/api/study";

export default function StudyCard(props: { study: StudyDto }): ReactElement {
    const router = useRouter();

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/studies/${props.study.id}/edit`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('정말로 이 스터디를 삭제하시겠습니까?')) {
            try {
                await deleteStudy(props.study.id);
                window.location.reload();
            } catch (error) {
                console.error('스터디 삭제 실패:', error);
                alert('스터디 삭제에 실패했습니다.');
            }
        }
    };

    return (
        <Card className="p-4 space-y-2 shadow-md hover:shadow-lg transition-shadow rounded-lg">
            <CardTitle>{props.study.title}</CardTitle>
            {/*<h2 className="text-lg font-semibold">{props.study.title}</h2>*/}
            <div className="flex items-center space-x-2">
                <Badge variant="outline" className={`px-2 py-0.5 rounded text-white text-xs ${
                    props.study.status === 'PENDING'
                        ? 'bg-red-500'
                        : props.study.status === 'IN_PROGRESS'
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                }`}>                    {props.study.status.toLowerCase()}</Badge>

                <Badge variant="outline"
                       className={`px-2 py-0.5 rounded text-white text-xs ${
                           props.study.type === 'PROJECT' ? 'bg-yellow-500' : 'bg-amber-800'
                       }`}
                >
                    {props.study.type.toLowerCase()}
                </Badge>
            </div>
            <CardDescription>{props.study.description}</CardDescription>
            <p className="text-sm text-gray-600 mb-1">참여 인원: {props.study.participantsCount}</p>
            <p className="text-sm text-gray-600">
                기간: {props.study.startDate} ~ {props.study.endDate ? props.study.endDate : '미정'}
            </p>
            <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                    수정
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    삭제
                </Button>
            </div>
        </Card>
    );
}