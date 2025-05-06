'use client'

import React, { use, useEffect, useState } from "react";
import StudyPlanDto from "@/dto/study/response/study-plan.dto";
import StudyPlanTable from "@/components/ui/study/study-plan-table";
import StudyDto from "@/dto/study/response/study.dto";
import { StudyStatus } from "@/dto/study/enum/study-status";
import { StudyType } from "@/dto/study/enum/study-type";
import { getStudyPlans, getStudy, updateStudy, createStudyPlan, updateStudyPlan, deleteStudyPlan, updateStudyPlanStatus } from "@/api/study";
import UpdateStudyDto from "@/dto/study/request/update-study.dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StudyPlanForm from "@/components/ui/study/study-plan-form";
import type { CreateStudyPlanDto, UpdateStudyPlanDto } from "@/api/study";
import { StudyPlanStatus } from "@/dto/study/enum/study-plan-status";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StudyDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

const studies: StudyDto[] = [
    {
        id: 1,
        title: 'AI 프로젝트 스터디',
        description: 'AI 기술을 활용한 팀 프로젝트를 진행합니다.',
        status: StudyStatus.PENDING,
        type: StudyType.PROJECT,
        startDate: new Date('2025-05-10'),
        endDate: new Date('2025-06-30'),
        participantsCount: 1
    },
    {
        id: 2,
        title: '프론트엔드 집중 스터디',
        description: 'React와 Next.js 기반으로 프론트엔드를 학습합니다.',
        status: StudyStatus.IN_PROGRESS,
        type: StudyType.BOOK,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-06-01'),
        participantsCount: 4
    },
    {
        id: 3,
        title: '알고리즘 문제풀이',
        description: '매주 토요일 알고리즘 문제 풀이와 해설',
        status: StudyStatus.ENDED,
        type: StudyType.PROJECT,
        startDate: new Date('2025-01-01'),
        endDate: undefined,
        participantsCount: 11
    },
];

export default function StudyDetailPage({ params }: StudyDetailPageProps) {
    const resolvedParams = use(params);
    const studyId = Number(resolvedParams.id);
    const [plans, setPlans] = useState<StudyPlanDto[]>([])
    const [study, setStudy] = useState<StudyDto>()
    const [isEditing, setIsEditing] = useState(false)
    const [updateData, setUpdateData] = useState<UpdateStudyDto>({})
    const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<StudyPlanDto | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isNaN(studyId)) {
            toast.error('잘못된 스터디 ID입니다.');
            router.push('/studies');
            return;
        }

        const fetchData = async () => {
            try {
                const [studyData, plansData] = await Promise.all([
                    getStudy(studyId),
                    getStudyPlans(studyId)
                ])
                setStudy(studyData)
                setPlans(plansData)
            } catch (error) {
                console.error('데이터 로딩 실패:', error)
                toast.error('스터디 정보를 불러오는데 실패했습니다.');
                router.push('/studies');
            }
        }
        void fetchData()
    }, [studyId, router])

    const handleUpdate = async () => {
        if (!study) return
        try {
            const updatedStudy = await updateStudy({
                id: study.id,
                dto: updateData
            })
            setStudy(updatedStudy)
            setIsEditing(false)
        } catch (error) {
            console.error('스터디 업데이트 실패:', error)
        }
    }

    const handleCreatePlan = async (data: CreateStudyPlanDto) => {
        try {
            const newPlan = await createStudyPlan(studyId, data);
            setPlans([...plans, newPlan]);
            setIsPlanFormOpen(false);
        } catch (error) {
            console.error('스터디 계획 생성 실패:', error);
        }
    };

    const handleUpdatePlan = async (planId: number, data: UpdateStudyPlanDto) => {
        try {
            const updatedPlan = await updateStudyPlan(studyId, planId, data);
            setPlans(plans.map(plan => plan.id === planId ? updatedPlan : plan));
            setSelectedPlan(null);
        } catch (error) {
            console.error('스터디 계획 수정 실패:', error);
        }
    };

    const handleDeletePlan = async (planId: number) => {
        try {
            await deleteStudyPlan(studyId, planId);
            setPlans(plans.filter(plan => plan.id !== planId));
        } catch (error) {
            console.error('스터디 계획 삭제 실패:', error);
        }
    };

    const handleStatusChange = async (planId: number, newStatus: StudyPlanStatus) => {
        try {
            const updatedPlan = await updateStudyPlanStatus(studyId, planId, newStatus);
            setPlans(plans.map(p => p.id === planId ? updatedPlan : p));
        } catch (error) {
            console.error('스터디 계획 상태 변경 실패:', error);
        }
    };

    if (!study) return <div>로딩중...</div>

    return (
        <div className="p-6">
            {isEditing ? (
                <div className="space-y-4">
                    <Input
                        placeholder="제목"
                        value={updateData.title ?? study.title}
                        onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
                    />
                    <Textarea
                        placeholder="설명"
                        value={updateData.description ?? study.description}
                        onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                    />
                    <Select
                        value={updateData.status ?? study.status}
                        onValueChange={(value) => setUpdateData({ ...updateData, status: value as StudyStatus })}
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
                    <Select
                        value={updateData.type ?? study.type}
                        onValueChange={(value) => setUpdateData({ ...updateData, type: value as StudyType })}
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
                    <div className="flex space-x-2">
                        <Button onClick={handleUpdate}>저장</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>취소</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">{study.title}</h1>
                    <p>{study.description}</p>
                    <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-100 rounded">{study.status}</span>
                        <span className="px-2 py-1 bg-green-100 rounded">{study.type}</span>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={() => setIsEditing(true)}>수정</Button>
                        <Button variant="outline" onClick={() => router.push(`/studies/${studyId}/invite`)}>
                            멤버 초대
                        </Button>
                    </div>
                </div>
            )}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">스터디 계획</h2>
                    <Dialog open={isPlanFormOpen} onOpenChange={setIsPlanFormOpen}>
                        <DialogTrigger asChild>
                            <Button>새 계획 추가</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>새 스터디 계획</DialogTitle>
                            </DialogHeader>
                            <StudyPlanForm
                                onSubmit={handleCreatePlan}
                                onCancel={() => setIsPlanFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="w-full max-w-full max-h-96 overflow-auto">
                    <StudyPlanTable
                        plans={plans}
                        onEdit={(plan) => setSelectedPlan(plan)}
                        onDelete={handleDeletePlan}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            </div>
            {selectedPlan && (
                <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>스터디 계획 수정</DialogTitle>
                        </DialogHeader>
                        <StudyPlanForm
                            initialData={selectedPlan}
                            onSubmit={(data) => handleUpdatePlan(selectedPlan.id, data)}
                            onCancel={() => setSelectedPlan(null)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}