'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api/auth';
import LoginRequestDto from '@/dto/auth/request/login-request.dto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginRequestDto>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
            router.push('/studies'); // 스터디 목록 페이지로 이동
        } catch (error) {
            setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>로그인</CardTitle>
                    <CardDescription>스터디 대시보드에 오신 것을 환영합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="email"
                                placeholder="이메일"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Input
                                type="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">로그인</Button>
                        <div className="text-center">
                            <Link href="/register" className="text-sm text-blue-500 hover:underline">
                                회원가입
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}