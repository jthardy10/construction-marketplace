import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    minBudget: '',
    maxBudget: '',
    category: '',
    skill: '',
    status: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
      const response = await api.get(`/projects?${queryParams}`);
      setProjects(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to fetch projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="text-center">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search projects"
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          name="minBudget"
          value={filters.minBudget}
          onChange={handleFilterChange}
          placeholder="Min Budget"
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          name="maxBudget"
          value={filters.maxBudget}
          onChange={handleFilterChange}
          placeholder="Max Budget"
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="Category"
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="skill"
          value={filters.skill}
          onChange={handleFilterChange}
          placeholder="Required Skill"
        />
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">
              <Link to={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-800">{project.title}</Link>
            </h3>
            <p className="text-gray-600 mb-2">{project.description}</p>
            <p className="text-gray-700"><span className="font-semibold">Budget:</span> ${project.budget}</p>
            <p className="text-gray-700"><span className="font-semibold">Location:</span> {project.location}</p>
            <p className="text-gray-700"><span className="font-semibold">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}</p>
            <p className="text-gray-700"><span className="font-semibold">End Date:</span> {new Date(project.endDate).toLocaleDateString()}</p>
            <p className="text-gray-700"><span className="font-semibold">Required Skills:</span> {project.requiredSkills.join(', ')}</p>
            <p className="text-gray-700"><span className="font-semibold">Categories:</span> {project.categories.join(', ')}</p>
            <p className="text-gray-700"><span className="font-semibold">Status:</span> {project.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
