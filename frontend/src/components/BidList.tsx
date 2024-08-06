import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Bid {
  _id: string;
  amount: number;
  proposal: string;
  status: string;
  contractorId: {
    _id: string;
    username: string;
    email: string;
  };
  submittedAt: string;
}

const BidList: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    fetchBids();
  }, [projectId]);

  const fetchBids = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/bids`);
      setBids(response.data);
    } catch (error) {
      console.error('Failed to fetch bids:', error);
    }
  };

  const handleStatusUpdate = async (bidId: string, newStatus: string) => {
    try {
      await api.put(`/bids/${bidId}/status`, { status: newStatus });
      fetchBids();  // Refresh bids after update
    } catch (error) {
      console.error('Failed to update bid status:', error);
    }
  };

  return (
    <div>
      <h2>Bids for Project</h2>
      {bids.map((bid) => (
        <div key={bid._id}>
          <p>Amount: ${bid.amount}</p>
          <p>Proposal: {bid.proposal}</p>
          <p>Status: {bid.status}</p>
          <p>Contractor: {bid.contractorId.username} ({bid.contractorId.email})</p>
          <p>Submitted: {new Date(bid.submittedAt).toLocaleString()}</p>
          {bid.status === 'pending' && (
            <div>
              <button onClick={() => handleStatusUpdate(bid._id, 'accepted')}>Accept</button>
              <button onClick={() => handleStatusUpdate(bid._id, 'rejected')}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BidList;
