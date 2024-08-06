import { Request, Response } from 'express';
import Project from '../models/Project';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, budget } = req.body;
    const clientId = req.user?.userId;

    if (!clientId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const project = new Project({
      title,
      description,
      budget,
      clientId
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, budget, status } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, budget, status },
      { new: true }
    );
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
