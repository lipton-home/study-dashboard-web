import StudyCard from '@/components/ui/study/study-card';
import StudyResponse from "@/api/study/dto/response/study-response";
import {StudyStatus} from "@/api/study/enum/study-status";
import {StudyType} from "@/api/study/enum/study-type";

export default function StudyPage() {
  const studies : StudyResponse[] = [
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

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {studies.map((study) => (
        <StudyCard key={study.id} study={study} />
      ))}
    </div>
  );
}