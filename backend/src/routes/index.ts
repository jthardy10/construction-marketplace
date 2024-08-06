import express from 'express';
import * as authController from '../controllers/authController';
import * as projectController from '../controllers/projectController';
import * as bidController from '../controllers/bidController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/projects', authenticateToken, authorizeRole(['client']), projectController.createProject);
router.get('/projects', authenticateToken, projectController.getProjects);
router.get('/projects/:id', authenticateToken, projectController.getProjectById);
router.put('/projects/:id', authenticateToken, authorizeRole(['client']), projectController.updateProject);
router.delete('/projects/:id', authenticateToken, authorizeRole(['client']), projectController.deleteProject);
router.patch('/projects/:id/milestone', authenticateToken, authorizeRole(['client']), projectController.updateMilestone);

router.post('/bids', authenticateToken, authorizeRole(['contractor']), bidController.createBid);
router.get('/projects/:projectId/bids', authenticateToken, bidController.getBidsByProject);
router.put('/bids/:id/status', authenticateToken, authorizeRole(['client']), bidController.updateBidStatus);

router.get('/users/:userId', authenticateToken, authController.getUserProfile);

export default router;
