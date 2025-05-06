'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createStudy } from "@/api/study";
import { StudyStatus } from "@/dto/study/enum/study-status";
import { StudyType } from "@/dto/study/enum/study-type";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

export default function NewStudyPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: StudyStatus.PENDING,
        type: StudyType.PROJECT,
        startDate: new Date(),
        endDate: undefined as Date | undefined,
    });

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast.error('제목을 입력해주세요.');
            return;
        }

        try {
            await createStudy(formData);
            toast.success('스터디가 생성되었습니다.');
            router.push('/studies');
        } catch (error) {
            console.error('스터디 생성 실패:', error);
            toast.error('스터디 생성에 실패했습니다.');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">새 스터디 만들기</h1>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">제목</label>
                    <Input
                        placeholder="스터디 제목"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">설명</label>
                    <Textarea
                        placeholder="스터디 설명"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">상태</label>
                    <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as StudyStatus })}
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
                    <label className="block text-sm font-medium mb-1">타입</label>
                    <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as StudyType })}
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

                <div>
                    <label className="block text-sm font-medium mb-1">시작일</label>
                    <DatePicker
                        selected={formData.startDate}
                        onChange={(date) => setFormData({ ...formData, startDate: date as Date })}
                        dateFormat="yyyy-MM-dd"
                        locale={ko}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">종료일 (선택사항)</label>
                    <DatePicker
                        selected={formData.endDate}
                        onChange={(date) => setFormData({ ...formData, endDate: date as Date })}
                        dateFormat="yyyy-MM-dd"
                        locale={ko}
                        className="w-full p-2 border rounded-md"
                        isClearable
                        placeholderText="종료일을 선택하세요"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/studies')}
                    >
                        취소
                    </Button>
                    <Button onClick={handleSubmit}>
                        생성
                    </Button>
                </div>
            </div>
        </div>
    );
} 