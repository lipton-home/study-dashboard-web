import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudyPlanStatus } from "@/dto/study/enum/study-plan-status";
import CreateStudyPlanDto from "@/dto/study/request/create-study-plan.dto";

interface StudyPlanFormProps {
    initialData?: CreateStudyPlanDto;
    onSubmit: (data: CreateStudyPlanDto) => void;
    onCancel: () => void;
}

export default function StudyPlanForm({ initialData, onSubmit, onCancel }: StudyPlanFormProps) {
    const [formData, setFormData] = React.useState<CreateStudyPlanDto>(initialData ?? {
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        status: StudyPlanStatus.PENDING
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                placeholder="제목"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
                placeholder="설명"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
                type="date"
                value={formData.startDate.toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
            />
            <Input
                type="date"
                value={formData.endDate.toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
            />
            <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as StudyPlanStatus })}
            >
                <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(StudyPlanStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex space-x-2">
                <Button type="submit">저장</Button>
                <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
            </div>
        </form>
    );
} 