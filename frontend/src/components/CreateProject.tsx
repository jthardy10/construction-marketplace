import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    location: '',
    requiredSkills: '',
    categories: '',
    maxBids: '10',
    milestones: [{ description: '', dueDate: '', paymentPercentage: '' }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const updatedMilestones = [...project.milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setProject({ ...project, milestones: updatedMilestones });
  };

  const addMilestone = () => {
    setProject({
      ...project,
      milestones: [...project.milestones, { description: '', dueDate: '', paymentPercentage: '' }]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedProject = {
        ...project,
        budget: parseFloat(project.budget),
        maxBids: parseInt(project.maxBids),
        requiredSkills: project.requiredSkills.split(',').map(skill => skill.trim()),
        categories: project.categories.split(',').map(category => category.trim()),
        milestones: project.milestones.map(milestone => ({
          ...milestone,
          paymentPercentage: parseFloat(milestone.paymentPercentage)
        }))
      };
      console.log('Sending project data:', formattedProject);
      const response = await api.post('/projects', formattedProject);
      console.log('Project created:', response.data);
      navigate(`/projects/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={project.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={project.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="budget"
        value={project.budget}
        onChange={handleChange}
        placeholder="Budget"
        required
      />
      <input
        type="date"
        name="startDate"
        value={project.startDate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="endDate"
        value={project.endDate}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        value={project.location}
        onChange={handleChange}
        placeholder="Location"
        required
      />
      <input
        type="text"
        name="requiredSkills"
        value={project.requiredSkills}
        onChange={handleChange}
        placeholder="Required Skills (comma-separated)"
      />
      <input
        type="text"
        name="categories"
        value={project.categories}
        onChange={handleChange}
        placeholder="Categories (comma-separated)"
      />
      <input
        type="number"
        name="maxBids"
        value={project.maxBids}
        onChange={handleChange}
        placeholder="Max Bids"
        required
      />
      {project.milestones.map((milestone, index) => (
        <div key={index}>
          <input
            type="text"
            value={milestone.description}
            onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
            placeholder="Milestone Description"
          />
          <input
            type="date"
            value={milestone.dueDate}
            onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
          />
          <input
            type="number"
            value={milestone.paymentPercentage}
            onChange={(e) => handleMilestoneChange(index, 'paymentPercentage', e.target.value)}
            placeholder="Payment Percentage"
          />
        </div>
      ))}
      <button type="button" onClick={addMilestone}>Add Milestone</button>
      <button type="submit">Create Project</button>
    </form>
  );
};

export default CreateProject;
