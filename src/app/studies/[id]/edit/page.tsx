'use client'

import React, {useEffect, useState} from "react";
import StudyDto from "@/dto/study/response/study.dto";
import {StudyStatus} from "@/dto/study/enum/study-status";
import {StudyType} from "@/dto/study/enum/study-type";
import {getStudy, updateStudy} from "@/api/study";
import UpdateStudyDto from "@/dto/study/request/update-study.dto";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface StudyEditPageProps {
    params: {
        id: string;
    }
}

export default function StudyEditPage({params}: StudyEditPageProps) {
    const router = useRouter();
    const studyId = Number(params.id);
    const [study, setStudy] = useState<StudyDto>();
    const [updateData, setUpdateData] = useState<UpdateStudyDto>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isNaN(studyId)) {
            console.error('잘못된 스터디 ID입니다.');
            return;
        }

        const fetchStudy = async () => {
            try {
                const studyData = await getStudy(studyId);
                setStudy(studyData);
                setUpdateData({
                    title: studyData.title,
                    description: studyData.description,
                    status: studyData.status,
                    type: studyData.type,
                    participantCount: studyData.participantsCount,
                    startDate: new Date(studyData.startDate),
                    endDate: studyData.endDate ? new Date(studyData.endDate) : undefined
                });
            } catch (error) {
                console.error('스터디 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchStudy();
    }, [studyId]);

    const handleUpdate = async () => {
        if (!study) return;
        try {
            await updateStudy({
                id: study.id,
                dto: updateData
            });
            router.push(`/studies/${study.id}`);
        } catch (error) {
            console.error('스터디 업데이트 실패:', error);
            alert('스터디 업데이트에 실패했습니다.');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">로딩중...</div>;
    }

    if (!study) {
        return <div className="flex justify-center items-center h-screen">스터디를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>스터디 수정</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Input
                                placeholder="제목"
                                value={updateData.title}
                                onChange={(e) => setUpdateData({...updateData, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <Textarea
                                placeholder="설명"
                                value={updateData.description}
                                onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
                            />
                        </div>
                        <div>
                            <Select
                                value={updateData.status}
                                onValueChange={(value) => setUpdateData({...updateData, status: value as StudyStatus})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="상태 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(StudyStatus).map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select
                                value={updateData.type}
                                onValueChange={(value) => setUpdateData({...updateData, type: value as StudyType})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="타입 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(StudyType).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => router.back()}>
                                취소
                            </Button>
                            <Button onClick={handleUpdate}>
                                저장
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 