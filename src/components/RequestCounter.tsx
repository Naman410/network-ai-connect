
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const RequestCounter: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();

  if (!user || !userProfile) return null;

  const remainingRequests = Math.max(0, 5 - userProfile.llm_requests_used);

  return (
    <div className="fixed top-4 right-4 z-20 flex items-center gap-3">
      <div className="glass px-4 py-2 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386z"/>
          </svg>
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {remainingRequests > 0 ? (
              <span className="text-green-600 dark:text-green-400">
                {remainingRequests}/5 AI matches left
              </span>
            ) : (
              <span className="text-orange-600 dark:text-orange-400">
                Using manual matching
              </span>
            )}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {userProfile.avatar_url && (
          <img 
            src={userProfile.avatar_url} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
          />
        )}
        <Button
          onClick={signOut}
          variant="ghost"
          size="sm"
          className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default RequestCounter;
