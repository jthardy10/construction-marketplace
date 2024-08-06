import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/projects');
        setProjects(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setError('Failed to fetch projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Projects</h2>
      {projects.map((project: any) => (
        <div key={project._id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <p>Budget: ${project.budget}</p>
          <p>Status: {project.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
