import React, { useState, useEffect } from 'react';
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

const BidComparison: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
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

  const toggleBidSelection = (bidId: string) => {
    setSelectedBids(prevSelected =>
      prevSelected.includes(bidId)
        ? prevSelected.filter(id => id !== bidId)
        : [...prevSelected, bidId]
    );
  };

  const getSelectedBids = () => bids.filter(bid => selectedBids.includes(bid._id));

  return (
    <div className="bid-comparison">
      <h2 className="text-2xl font-bold mb-4">Bid Comparison</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bid-list">
          <h3 className="text-xl font-semibold mb-2">All Bids</h3>
          {bids.map(bid => (
            <div key={bid._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedBids.includes(bid._id)}
                onChange={() => toggleBidSelection(bid._id)}
                className="mr-2"
              />
              <span>{bid.contractorId.username} - ${bid.amount}</span>
            </div>
          ))}
        </div>
        <div className="comparison-table">
          <h3 className="text-xl font-semibold mb-2">Comparison</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Contractor</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Proposal</th>
              </tr>
            </thead>
            <tbody>
              {getSelectedBids().map(bid => (
                <tr key={bid._id}>
                  <td className="border p-2">{bid.contractorId.username}</td>
                  <td className="border p-2">${bid.amount}</td>
                  <td className="border p-2">{bid.proposal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BidComparison;
