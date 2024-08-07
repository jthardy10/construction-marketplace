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
     const response = await api.post('/projects', formattedProject);
     navigate(`/projects/${response.data._id}`);
   } catch (error) {
     console.error('Failed to create project:', error);
   }
 };

 return (
   <div className="max-w-2xl mx-auto">
     <h2 className="text-2xl font-bold mb-4">Create Project</h2>
     <form onSubmit={handleSubmit} className="space-y-4">
       <div>
         <label className="block text-sm font-medium text-gray-700">Title</label>
         <input
           type="text"
           name="title"
           value={project.title}
           onChange={handleChange}
           required
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700">Description</label>
         <textarea
           name="description"
           value={project.description}
           onChange={handleChange}
           required
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700">Budget</label>
         <input
           type="number"
           name="budget"
           value={project.budget}
           onChange={handleChange}
           required
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700">Start Date</label>
         <input
           type="date"
           name="startDate"
           value={project.startDate}
           onChange={handleChange}
           required
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700">End Date</label>
         <input
           type="date"
           name="endDate"
           value={project.endDate}
           onChange={handleChange}
           required
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700">Location</label>
         <input
           type="text"
           name="location"
           value={project.location}
           onChange={handleChange}
           required
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
         <input
           type="text"
           name="requiredSkills"
           value={project.requiredSkills}
           onChange={handleChange}
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700">Categories (comma-separated)</label>
         <input
           type="text"
           name="categories"
           value={project.categories}
           onChange={handleChange}
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700">Max Bids</label>
         <input
           type="number"
           name="maxBids"
           value={project.maxBids}
           onChange={handleChange}
           required
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
         />
       </div>
       <div>
         <h3 className="text-lg font-medium text-gray-700 mb-2">Milestones</h3>
         {project.milestones.map((milestone, index) => (
           <div key={index} className="space-y-2 mb-4">
             <input
               type="text"
               value={milestone.description}
               onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
               placeholder="Milestone Description"
               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
             />
             <input
               type="date"
               value={milestone.dueDate}
               onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
             />
             <input
               type="number"
               value={milestone.paymentPercentage}
               onChange={(e) => handleMilestoneChange(index, 'paymentPercentage', e.target.value)}
               placeholder="Payment Percentage"
               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
             />
           </div>
         ))}
         <button type="button" onClick={addMilestone} className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
           Add Milestone
         </button>
       </div>
       <div>
         <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
           Create Project
         </button>
       </div>
     </form>
   </div>
 );
};

export default CreateProject;
