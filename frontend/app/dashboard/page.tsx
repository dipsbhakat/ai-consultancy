import { ProjectList } from '@/components/projects/ProjectList';
import { NewProjectButton } from '@/components/projects/NewProjectButton';
import { Suspense } from 'react';
import { ProjectsSkeleton } from '@/components/projects/ProjectsSkeleton';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <NewProjectButton />
      </div>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  );
}
