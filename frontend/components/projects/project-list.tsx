'use client';

import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
}

export function ProjectList() {
  const [projects] = useState<Project[]>([]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Create your first project!</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="p-4 bg-white rounded shadow">
            {project.name}
          </div>
        ))
      )}
    </div>
  );
}
