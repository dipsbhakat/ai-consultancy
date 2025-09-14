import { ProjectList } from '@/components/projects/project-list';
import { NewProjectButton } from '@/components/projects/new-project-button';
import { Suspense } from 'react';
import { ProjectsSkeleton } from '@/components/projects/projects-skeleton';

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
