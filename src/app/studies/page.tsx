'use client'
import React, { use, useEffect, useState } from "react";
import StudyPlaneDto from "@/dto/study/response/study-plane.dto";
import StudyPlanTable from "@/components/ui/study/study-plan-table";
import StudyDto from "@/dto/study/response/study.dto";
import { StudyStatus } from "@/dto/study/enum/study-status";
import { StudyType } from "@/dto/study/enum/study-type";
import { getStudyPlans, getStudy, updateStudy } from "@/api/study";
import UpdateStudyDto from "@/dto/study/request/update-study.dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudyCard from '@/components/ui/study/study-card';
import { Pagination } from "@/dto/pagination";
import { getStudies, createStudy, getStudyInvites, StudyInviteDto } from "@/api/study";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateStudyDto from "@/dto/study/request/create-study.dto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface StudyDetailPageProps {
  id: string;
}

export default function StudyPage() {
  const router = useRouter();
  const [studies, setStudies] = useState<Pagination<StudyDto>>();
  const [invites, setInvites] = useState<StudyInviteDto[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studiesData, invitesData] = await Promise.all([
          getStudies(currentPage),
          getStudyInvites()
        ]);
        setStudies(studiesData);
        setInvites(invitesData);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };
    void fetchData();
  }, [currentPage]);

  const getStatusColor = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StudyStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case StudyStatus.ENDED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: StudyType) => {
    switch (type) {
      case StudyType.BOOK:
        return "bg-green-100 text-green-800";
      case StudyType.PROJECT:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">스터디 목록</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setIsInviteDialogOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {invites.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}
          </Button>
          <Button onClick={() => router.push('/studies/new')}>
            새 스터디 만들기
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>참여자 수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studies?.content.map((study: StudyDto) => (
              <TableRow 
                key={study.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => router.push(`/studies/${study.id}`)}
              >
                <TableCell className="font-medium">{study.title}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(study.status)}>
                    {study.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(study.type)}>
                    {study.type}
                  </Badge>
                </TableCell>
                <TableCell>{study.startDate}</TableCell>
                <TableCell>{study.endDate ?? '-'}</TableCell>
                <TableCell>{study.participantsCount}명</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {studies && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            이전
          </Button>
          {Array.from({ length: studies.totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === studies.totalPages - 1}
          >
            다음
          </Button>
        </div>
      )}

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스터디 초대 목록</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {invites.length === 0 ? (
              <p className="text-center text-gray-500">받은 초대가 없습니다.</p>
            ) : (
              invites.map((invite) => (
                <div
                  key={`${invite.userId}-${invite.studyId}`}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{invite.studyTitle}</p>
                    <p className="text-sm text-gray-500">스터디 ID: {invite.studyId}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/studies/${invite.studyId}`)}
                  >
                    확인하기
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}