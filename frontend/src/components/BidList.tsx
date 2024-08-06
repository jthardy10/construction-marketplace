import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { RootState } from '../store';

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
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const userRole = useSelector((state: RootState) => state.auth.user?.role);
 const userId = useSelector((state: RootState) => state.auth.user?.id);

 useEffect(() => {
   fetchBids();
 }, [projectId]);

 const fetchBids = async () => {
   try {
     setLoading(true);
     const response = await api.get(`/projects/${projectId}/bids`);
     setBids(response.data);
     setError(null);
   } catch (error) {
     console.error('Failed to fetch bids:', error);
     setError('Failed to fetch bids. Please try again later.');
   } finally {
     setLoading(false);
   }
 };

 const handleStatusUpdate = async (bidId: string, newStatus: string) => {
   try {
     await api.put(`/bids/${bidId}/status`, { status: newStatus });
     fetchBids();
   } catch (error) {
     console.error('Failed to update bid status:', error);
   }
 };

 const handleDeleteBid = async (bidId: string) => {
   try {
     await api.delete(`/bids/${bidId}`);
     fetchBids();
   } catch (error) {
     console.error('Failed to delete bid:', error);
   }
 };

 if (loading) {
   return <div className="text-center">Loading bids...</div>;
 }

 if (error) {
   return <div className="text-red-500 text-center">{error}</div>;
 }

 return (
   <div>
     <h2 className="text-2xl font-bold mb-4">Bids for Project</h2>
     <div className="space-y-4">
       {bids.map((bid) => (
         <div key={bid._id} className="bg-white shadow-md rounded-lg p-4">
           <p className="text-lg font-semibold">Amount: ${bid.amount}</p>
           <p className="text-gray-600 mb-2">{bid.proposal}</p>
           <p className="text-gray-700"><span className="font-semibold">Status:</span> {bid.status}</p>
           <p className="text-gray-700"><span className="font-semibold">Contractor:</span> {bid.contractorId.username} ({bid.contractorId.email})</p>
           <p className="text-gray-700"><span className="font-semibold">Submitted:</span> {new Date(bid.submittedAt).toLocaleString()}</p>
           {userRole === 'client' && bid.status === 'pending' && (
             <div className="mt-4">
               <button
                 onClick={() => handleStatusUpdate(bid._id, 'accepted')}
                 className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
               >
                 Accept
               </button>
               <button
                 onClick={() => handleStatusUpdate(bid._id, 'rejected')}
                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
               >
                 Reject
               </button>
             </div>
           )}
           {userRole === 'contractor' && bid.contractorId._id === userId && bid.status === 'pending' && (
             <div className="mt-4">
               <button
                 onClick={() => handleDeleteBid(bid._id)}
                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
               >
                 Delete Bid
               </button>
             </div>
           )}
         </div>
       ))}
     </div>
   </div>
 );
};

export default BidList;
