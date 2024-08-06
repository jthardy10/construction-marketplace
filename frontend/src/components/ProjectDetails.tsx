import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { RootState } from '../store';

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
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

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
      fetchProject();
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading project details...</div>;
  }

  if (error || !project) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <p className="text-gray-700"><span className="font-semibold">Budget:</span> ${project.budget}</p>
        <p className="text-gray-700"><span className="font-semibold">Location:</span> {project.location}</p>
        <p className="text-gray-700"><span className="font-semibold">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}</p>
        <p className="text-gray-700"><span className="font-semibold">End Date:</span> {new Date(project.endDate).toLocaleDateString()}</p>
        <p className="text-gray-700"><span className="font-semibold">Required Skills:</span> {project.requiredSkills.join(', ')}</p>
        <p className="text-gray-700"><span className="font-semibold">Categories:</span> {project.categories.join(', ')}</p>
        <p className="text-gray-700"><span className="font-semibold">Status:</span> {project.status}</p>
      </div>
      {userRole === 'contractor' && project.status === 'open' && (
        <div className="mb-6">
          <Link
            to={`/projects/${id}/bids/create`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Bid
          </Link>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-4">Milestones</h3>
      <div className="space-y-4">
        {project.milestones.map((milestone) => (
          <div key={milestone._id} className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold">{milestone.description}</p>
            <p className="text-gray-700"><span className="font-semibold">Due Date:</span> {new Date(milestone.dueDate).toLocaleDateString()}</p>
            <p className="text-gray-700"><span className="font-semibold">Payment Percentage:</span> {milestone.paymentPercentage}%</p>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={milestone.completed}
                onChange={(e) => handleMilestoneCompletion(milestone._id, e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Completed</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
