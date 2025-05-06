'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/api/auth';
import RegisterRequestDto from '@/dto/auth/request/register-request.dto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterRequestDto>({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(formData);
            router.push('/studies');
        } catch (error) {
            setError('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>회원가입</CardTitle>
                    <CardDescription>새로운 계정을 만들어보세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="text"
                                placeholder="이름"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
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
                        <Button type="submit" className="w-full">회원가입</Button>
                        <div className="text-center">
                            <Link href="/login" className="text-sm text-blue-500 hover:underline">
                                로그인
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 