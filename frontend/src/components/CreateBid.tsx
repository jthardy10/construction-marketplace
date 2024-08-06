import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const CreateBid: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const { projectId } = useParams<{ projectId: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/bids', { projectId, amount: parseFloat(amount), proposal });
    } catch (error) {
      console.error('Failed to create bid:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Bid Amount"
        required
      />
      <textarea
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        placeholder="Proposal"
        required
      />
      <button type="submit">Submit Bid</button>
    </form>
  );
};

export default CreateBid;
