import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import { API } from '../api';

export default function Profile() {
    const { user, isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.get(`${API}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setUsernameInput(res.data.username || '');
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Could not load your profile.');
        } finally {
            setLoading(false);
        }
    }, [getAccessTokenSilently]);

    useEffect(() => {
        if (isAuthenticated) fetchProfile();
        else setLoading(false);
    }, [isAuthenticated, fetchProfile]);

    const handleSave = async () => {
        if (!usernameInput.trim()) return;
        setSaving(true);
        setError('');
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.patch(
                `${API}/users/me`,
                { username: usernameInput.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfile(res.data);
            setEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.error || 'Could not update username.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setUsernameInput(profile?.username || '');
        setEditing(false);
        setError('');
    };

    if (!isAuthenticated) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <p className="profile-signin-msg">Please sign in to view your profile.</p>
                    <button className="loginbtn" onClick={() => loginWithRedirect()}>Login</button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="profile-page"><p className="profile-loading">Loading profile...</p></div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                <img
                    className="profile-avatar"
                    src={profile?.picture || user?.picture}
                    alt="Profile avatar"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar-profile.png';
                    }}
                />

                <div className="profile-field">
                    <label>Username</label>
                    {editing ? (
                        <div className="profile-edit-row">
                            <input
                                type="text"
                                value={usernameInput}
                                maxLength={20}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                autoFocus
                            />
                            <button className="profile-icon-btn" onClick={handleSave} disabled={saving} aria-label="Save">
                                <FaCheck />
                            </button>
                            <button className="profile-icon-btn" onClick={handleCancel} disabled={saving} aria-label="Cancel">
                                <FaTimes />
                            </button>
                        </div>
                    ) : (
                        <div className="profile-edit-row">
                            <span className="profile-value">{profile?.username || 'Anonymous'}</span>
                            <button className="profile-icon-btn" onClick={() => setEditing(true)} aria-label="Edit username">
                                <FaPen />
                            </button>
                        </div>
                    )}
                </div>

                <div className="profile-field">
                    <label>Email</label>
                    <span className="profile-value">{profile?.email}</span>
                </div>

                {profile?.createdAt && (
                    <div className="profile-field">
                        <label>Member Since</label>
                        <span className="profile-value">
                            {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                )}

                {error && <p className="profile-error">{error}</p>}
            </div>
        </div>
    );
}