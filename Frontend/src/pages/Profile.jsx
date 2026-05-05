import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('settings');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Update local state when user data is available
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const updates = { name: profile.name };
      // Only include password if the user entered a new one
      if (profile.password) {
        if(profile.password.length < 6) {
           setError('Password must be at least 6 characters');
           setIsLoading(false);
           return;
        }
        updates.password = profile.password;
      }

      await updateProfile(updates);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setProfile(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfile({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
    setError('');
    setMessage('');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <main className="profile-page" id="profile-page">
      <div className="container">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-cover" />
          <div className="profile-header-content">
            <div className="profile-avatar">
              <div className="profile-icon">🛒</div>
              <span className="avatar-status" />
            </div>
            <div className="profile-header-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'settings' && (
            <div className="settings-section animate-fade-in" id="settings-section">
              <div className="settings-card">
                <div className="settings-header">
                  <h3>Account Information</h3>
                  {!isEditing && (
                    <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>
                
                {message && <div style={{ color: 'green', marginBottom: '15px' }}>{message}</div>}
                {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                <div className="settings-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter your name"
                      value={profile.name}
                      onChange={e => setProfile({ ...profile, name: e.target.value })}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={profile.email}
                      readOnly={true} // Email should usually stay readOnly or have a specific flow
                      disabled
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">New Password (leave blank to keep current)</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={profile.password}
                        onChange={e => setProfile({ ...profile, password: e.target.value })}
                      />
                    </div>
                  )}

                  {isEditing && (
                    <div className="form-actions">
                      <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button className="btn btn-outline" onClick={handleCancel} disabled={isLoading}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
