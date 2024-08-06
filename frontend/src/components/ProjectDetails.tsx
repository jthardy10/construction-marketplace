import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Milestone {
  _id: string;
  description: string;
  dueDate: string;
  completed: boolean;
  paymentPercentage: number;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  location: string;
  requiredSkills: string[];
  categories: string[];
  status: string;
  milestones: Milestone[];
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      setError('Failed to fetch project details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneCompletion = async (milestoneId: string, completed: boolean) => {
    try {
      await api.patch(`/projects/${id}/milestone`, { milestoneId, completed });
      fetchProject();  // Refresh project data
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  if (loading) {
    return <div>Loading project details...</div>;
  }

  if (error || !project) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>Budget: ${project.budget}</p>
      <p>Location: {project.location}</p>
      <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
      <p>Required Skills: {project.requiredSkills.join(', ')}</p>
      <p>Categories: {project.categories.join(', ')}</p>
      <p>Status: {project.status}</p>
      <h3>Milestones</h3>
      {project.milestones.map((milestone) => (
        <div key={milestone._id}>
          <p>{milestone.description}</p>
          <p>Due Date: {new Date(milestone.dueDate).toLocaleDateString()}</p>
          <p>Payment Percentage: {milestone.paymentPercentage}%</p>
          <label>
            Completed:
            <input
              type="checkbox"
              checked={milestone.completed}
              onChange={(e) => handleMilestoneCompletion(milestone._id, e.target.checked)}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default ProjectDetails;
