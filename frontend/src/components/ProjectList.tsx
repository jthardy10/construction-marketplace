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
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Projects</h2>
      <div>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search projects"
        />
        <input
          type="number"
          name="minBudget"
          value={filters.minBudget}
          onChange={handleFilterChange}
          placeholder="Min Budget"
        />
        <input
          type="number"
          name="maxBudget"
          value={filters.maxBudget}
          onChange={handleFilterChange}
          placeholder="Max Budget"
        />
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="Category"
        />
        <input
          type="text"
          name="skill"
          value={filters.skill}
          onChange={handleFilterChange}
          placeholder="Required Skill"
        />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {projects.map((project) => (
        <div key={project._id}>
          <h3><Link to={`/projects/${project._id}`}>{project.title}</Link></h3>
          <p>{project.description}</p>
          <p>Budget: ${project.budget}</p>
          <p>Location: {project.location}</p>
          <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
          <p>Required Skills: {project.requiredSkills.join(', ')}</p>
          <p>Categories: {project.categories.join(', ')}</p>
          <p>Status: {project.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
