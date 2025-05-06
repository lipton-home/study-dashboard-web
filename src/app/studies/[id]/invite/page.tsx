'use client'

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteUsersToStudy } from "@/api/study";
import { toast } from "sonner";

interface StudyInvitePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function StudyInvitePage({ params }: StudyInvitePageProps) {
    const resolvedParams = use(params);
    const studyId = Number(resolvedParams.id);
    const router = useRouter();
    const [emails, setEmails] = useState<string[]>([]);
    const [currentEmail, setCurrentEmail] = useState("");

    const handleAddEmail = () => {
        if (currentEmail && !emails.includes(currentEmail)) {
            setEmails([...emails, currentEmail]);
            setCurrentEmail("");
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setEmails(emails.filter(email => email !== emailToRemove));
    };

    const handleSubmit = async () => {
        if (emails.length === 0) {
            toast.error("최소 한 명 이상의 이메일을 입력해주세요.");
            return;
        }

        try {
            await inviteUsersToStudy(studyId, { emails });
            toast.success("초대가 완료되었습니다.");
            router.push(`/studies/${studyId}`);
        } catch (error) {
            toast.error("초대 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">스터디 멤버 초대</h1>
            
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        type="email"
                        placeholder="이메일 주소 입력"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEmail();
                            }
                        }}
                    />
                    <Button onClick={handleAddEmail}>추가</Button>
                </div>

                <div className="space-y-2">
                    {emails.map((email) => (
                        <div key={email} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>{email}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEmail(email)}
                            >
                                삭제
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/studies/${studyId}`)}
                    >
                        취소
                    </Button>
                    <Button onClick={handleSubmit}>
                        초대하기
                    </Button>
                </div>
            </div>
        </div>
    );
} 