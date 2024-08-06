import { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Received project data:', req.body);
    
    const {
      title,
      description,
      budget,
      startDate,
      endDate,
      location,
      requiredSkills,
      categories,
      maxBids,
      milestones
    } = req.body;
    
    const clientId = req.user?.userId;

    if (!clientId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const project: IProject = new Project({
      title,
      description,
      budget,
      clientId,
      startDate,
      endDate,
      location,
      requiredSkills,
      categories,
      maxBids,
      milestones
    });

    await project.save();
    res.status(201).json(project);
  } catch (error: unknown) {
    console.error('Error creating project:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Failed to create project', details: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create project', details: 'An unknown error occurred' });
    }
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      search, 
      minBudget, 
      maxBudget, 
      category, 
      skill, 
      status 
    } = req.query;

    let query: any = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') }
      ];
    }

    if (minBudget) query.budget = { $gte: Number(minBudget) };
    if (maxBudget) query.budget = { ...query.budget, $lte: Number(maxBudget) };
    if (category) query.categories = category;
    if (skill) query.requiredSkills = skill;
    if (status) query.status = status;

    const projects = await Project.find(query).populate('clientId', 'username email');
    res.json(projects);
  } catch (error: unknown) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id).populate('clientId', 'username email');
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error: unknown) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      budget,
      status,
      startDate,
      endDate,
      location,
      requiredSkills,
      categories,
      maxBids,
      milestones
    } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        budget,
        status,
        startDate,
        endDate,
        location,
        requiredSkills,
        categories,
        maxBids,
        milestones
      },
      { new: true }
    );

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error: unknown) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const updateMilestone = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: projectId } = req.params;
    const { milestoneId, completed } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const milestoneIndex = project.milestones.findIndex(m => m._id?.toString() === milestoneId);

    if (milestoneIndex === -1) {
      res.status(404).json({ error: 'Milestone not found' });
      return;
    }

    project.milestones[milestoneIndex].completed = completed;
    await project.save();

    res.json(project);
  } catch (error: unknown) {
    console.error('Error updating milestone:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Failed to update milestone', details: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update milestone', details: 'An unknown error occurred' });
    }
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

