import React, { useState } from 'react';
import { Profile } from '../../types';
import { mockApi } from '../../services/api';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

interface ReportBlockModalProps {
  targetUser: Profile;
  onClose: () => void;
  onBlock: () => void;
}

const reportReasons = [
  "Inappropriate Photos",
  "Spam or Scam",
  "Harassment or Hate Speech",
  "Underage",
  "Something else",
];

const ReportBlockModal: React.FC<ReportBlockModalProps> = ({ targetUser, onClose, onBlock }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleSubmit = async () => {
    if (!user || !selectedReason) return;
    setLoading(true);
    try {
        await mockApi.reportUser(user.id, targetUser.userId, selectedReason);
        await mockApi.blockUser(user.id, targetUser.userId);
        alert(`${targetUser.name} has been reported and blocked. You will no longer see them.`);
        onBlock();
    } catch (error) {
        console.error("Failed to report/block user", error);
        alert("An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
        <h2 className="text-xl font-bold text-center">Report & Block {targetUser.name}</h2>
        <p className="text-text-secondary text-center text-sm mt-1">Your safety is our priority. Please select a reason for your report.</p>
        
        <div className="my-4 space-y-2">
            {reportReasons.map(reason => (
                <button 
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${selectedReason === reason ? 'bg-primary/20 border-primary' : 'bg-white border-gray-300 hover:border-primary/50'}`}
                >
                    {reason}
                </button>
            ))}
        </div>

        <div className="space-y-3">
          <Button onClick={handleSubmit} isLoading={loading} disabled={!selectedReason}>
            Submit Report & Block
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default ReportBlockModal;
