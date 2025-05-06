import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StudyPlanDto from "@/dto/study/response/study-plan.dto";
import { StudyPlanStatus } from "@/dto/study/enum/study-plan-status";
import { Badge } from "@/components/ui/badge";

interface StudyPlanTableProps {
    plans: StudyPlanDto[];
    onEdit: (plan: StudyPlanDto) => void;
    onDelete: (planId: number) => void;
    onStatusChange: (planId: number, status: StudyPlanStatus) => void;
}

const statusColors: Record<StudyPlanStatus, string> = {
    [StudyPlanStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [StudyPlanStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
    [StudyPlanStatus.ENDED]: "bg-green-100 text-green-800",
};

const statusOrder: StudyPlanStatus[] = [
    StudyPlanStatus.PENDING,
    StudyPlanStatus.IN_PROGRESS,
    StudyPlanStatus.ENDED,
];

export default function StudyPlanTable({ plans, onEdit, onDelete, onStatusChange }: StudyPlanTableProps) {
    const getNextStatus = (currentStatus: StudyPlanStatus): StudyPlanStatus => {
        const currentIndex = statusOrder.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return statusOrder[nextIndex];
    };

    return (
        <div className="max-h-80 overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>제목</TableHead>
                        <TableHead>설명</TableHead>
                        <TableHead>시작일</TableHead>
                        <TableHead>종료일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>작업</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {plans.map((plan) => (
                        <TableRow key={plan.id}>
                            <TableCell>{plan.title}</TableCell>
                            <TableCell>{plan.description}</TableCell>
                            <TableCell>{plan.startDate.toLocaleDateString()}</TableCell>
                            <TableCell>{plan.endDate.toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge 
                                    className={`cursor-pointer ${statusColors[plan.status]}`}
                                    onClick={() => onStatusChange(plan.id, getNextStatus(plan.status))}
                                >
                                    {plan.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                                        수정
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(plan.id)}>
                                        삭제
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}