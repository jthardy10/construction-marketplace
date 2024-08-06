import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Bid {
 _id: string;
 projectId: {
   _id: string;
   title: string;
 };
 amount: number;
 proposal: string;
 status: string;
 submittedAt: string;
}

const ContractorDashboard: React.FC = () => {
 const [bids, setBids] = useState<Bid[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
   fetchContractorBids();
 }, []);

 const fetchContractorBids = async () => {
   try {
     setLoading(true);
     const response = await api.get('/bids/contractor');
     setBids(response.data);
     setError(null);
   } catch (error) {
     console.error('Failed to fetch contractor bids:', error);
     setError('Failed to fetch bids. Please try again later.');
   } finally {
     setLoading(false);
   }
 };

 const handleDeleteBid = async (bidId: string) => {
   try {
     await api.delete(`/bids/${bidId}`);
     fetchContractorBids();
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
     <h2 className="text-2xl font-bold mb-4">Your Bids</h2>
     <div className="space-y-4">
       {bids.map((bid) => (
         <div key={bid._id} className="bg-white shadow-md rounded-lg p-4">
           <h3 className="text-lg font-semibold">
             <Link to={`/projects/${bid.projectId._id}`} className="text-blue-600 hover:text-blue-800">
               {bid.projectId.title}
             </Link>
           </h3>
           <p className="text-gray-700"><span className="font-semibold">Amount:</span> ${bid.amount}</p>
           <p className="text-gray-600 mb-2">{bid.proposal}</p>
           <p className="text-gray-700"><span className="font-semibold">Status:</span> {bid.status}</p>
           <p className="text-gray-700"><span className="font-semibold">Submitted:</span> {new Date(bid.submittedAt).toLocaleString()}</p>
           {bid.status === 'pending' && (
             <div className="mt-4">
               <Link
                 to={`/bids/${bid._id}/edit`}
                 className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
               >
                 Edit
               </Link>
               <button
                 onClick={() => handleDeleteBid(bid._id)}
                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
               >
                 Delete
               </button>
             </div>
           )}
         </div>
       ))}
     </div>
   </div>
 );
};

export default ContractorDashboard;
