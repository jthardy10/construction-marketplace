import { Request, Response } from 'express';
import Bid from '../models/Bid';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const createBid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId, amount, proposal } = req.body;
    const contractorId = req.user?.userId;

    if (!contractorId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const bid = new Bid({
      projectId,
      contractorId,
      amount,
      proposal
    });

    await bid.save();
    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bid' });
  }
};

export const getBidsByProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const bids = await Bid.find({ projectId: req.params.projectId });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
};

export const updateBidStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const bid = await Bid.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!bid) {
      res.status(404).json({ error: 'Bid not found' });
      return;
    }
    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bid status' });
  }
};
