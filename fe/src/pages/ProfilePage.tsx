import React from 'react';
import { useAuth } from '../context/AuthContext';

// Assuming a GlassCard-like style as suggested in the prompt and used elsewhere.
// No actual GlassCard component is imported, direct styling is applied.

const ProfilePage: React.FC = () => {
  const { currentUser, logout, loading } = useAuth();

  if (loading && !currentUser) {
    // Show a loading indicator if auth state is still being determined
    // and no user is yet available (e.g., on initial page load checking localStorage)
    return (
      <div className="p-4 md:p-6 text-center">
        <p className="text-white/80 text-lg">Loading profile...</p>
        {/* You could add a spinner here */}
      </div>
    );
  }

  if (!currentUser) {
    // This case should ideally be handled by a protected route later
    // For now, it shows a message if the user is definitely logged out.
    return (
      <div className="p-4 md:p-6 text-center max-w-md mx-auto">
        <div className="bg-background-dark/70 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10">
          <h1 className="text-2xl font-semibold text-white mb-4">Access Denied</h1>
          <p className="text-white/80 mb-6">Please log in to view your profile.</p>
          {/* Optionally, include a button to navigate to login, though routing handles this better */}
          {/* <button className="px-6 py-2 bg-primary text-black rounded-lg font-medium">Login</button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent py-2">
          User Profile
        </h1>
      </header>

      <div className="bg-background-darker/80 backdrop-blur-xl p-6 sm:p-8 rounded-xl shadow-2xl border border-white/10">
        <div className="space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-white/50 uppercase tracking-wider mb-1">Email Address</label>
            <p className="text-md sm:text-lg text-white/90 break-all">{currentUser.email}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-white/50 uppercase tracking-wider mb-1">Display Name</label>
            <p className="text-md sm:text-lg text-white/90">{currentUser.displayName || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-white/50 uppercase tracking-wider mb-1">User ID</label>
            <p className="text-xs sm:text-sm text-white/70 break-all">{currentUser.id}</p>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 border-t border-white/10 pt-6 sm:pt-8">
          <button
            onClick={logout}
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 rounded-lg bg-red-500/80 hover:bg-red-500/100 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-background-darker disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
