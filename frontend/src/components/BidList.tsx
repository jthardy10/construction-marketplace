import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const BidList: React.FC = () => {
  const [bids, setBids] = useState([]);
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/bids`);
        setBids(response.data);
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      }
    };

    fetchBids();
  }, [projectId]);

  return (
    <div>
      <h2>Bids for Project</h2>
      {bids.map((bid: any) => (
        <div key={bid._id}>
          <p>Amount: ${bid.amount}</p>
          <p>Proposal: {bid.proposal}</p>
          <p>Status: {bid.status}</p>
        </div>
      ))}
    </div>
  );
};

export default BidList;
