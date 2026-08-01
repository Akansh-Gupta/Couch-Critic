import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const MAX_COMPOSER_HEIGHT = 160;

function CommentComposer({ value, onChange, onSubmit, submitting, placeholder, autoFocus }) {
    const textareaRef = useRef(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, MAX_COMPOSER_HEIGHT) + 'px';
    }, [value]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !submitting) onSubmit();
        }
    };

    return (
        <div className="comment-composer">
            <textarea
                ref={textareaRef}
                className="comment"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                maxLength={1000}
                autoFocus={autoFocus}
                style={{ maxHeight: `${MAX_COMPOSER_HEIGHT}px` }}
            ></textarea>
            {value.trim() && (
                <button
                    type="button"
                    className="comment-send-btn"
                    onClick={onSubmit}
                    disabled={submitting}
                    aria-label="Post comment"
                >
                    <FaPaperPlane />
                </button>
            )}
        </div>
    );
}

export default function Comments({ itemId, itemType }) {
    const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } = useAuth0();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [editError, setEditError] = useState('');

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [replyError, setReplyError] = useState('');

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchComments = useCallback(async () => {
        if (!itemType || !itemId) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:4000/comments/${itemType}/${itemId}`);
            setComments(res.data);
        } catch (err) {
            console.error('Failed to load comments:', err.message);
        } finally {
            setLoading(false);
        }
    }, [itemType, itemId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const postComment = async () => {
        if (!text.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.post('http://localhost:4000/comments', {
                itemId, itemType, text: text.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prev => [res.data, ...prev]);
            setText('');
        } catch (err) {
            console.error('Failed to post comment:', err.message);
            setError('Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (c) => {
        setEditingId(c._id);
        setEditText(c.text);
        setEditError('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
        setEditError('');
    };

    const saveEdit = async (id) => {
        if (!editText.trim()) return;
        setEditError('');
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.patch(`http://localhost:4000/comments/${id}`, {
                text: editText.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prev => prev.map(c => c._id === id ? res.data : c));
            cancelEdit();
        } catch (err) {
            console.error('Failed to edit comment:', err.message);
            setEditError('Failed to save changes. Please try again.');
        }
    };

    const startReply = (id) => {
        setReplyingTo(id);
        setReplyText('');
        setReplyError('');
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
        setReplyError('');
    };

    const postReply = async (parentId) => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        setReplyError('');
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.post('http://localhost:4000/comments', {
                itemId, itemType, text: replyText.trim(), parentId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prev => [...prev, res.data]);
            cancelReply();
        } catch (err) {
            console.error('Failed to post reply:', err.message);
            setReplyError('Failed to post reply. Please try again.');
        } finally {
            setSubmittingReply(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const token = await getAccessTokenSilently();
            await axios.delete(`http://localhost:4000/comments/${deleteTarget}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prev => prev.filter(c => c._id !== deleteTarget && c.parentId !== deleteTarget));
        } catch (err) {
            console.error('Failed to delete comment:', err.message);
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const topLevelComments = comments.filter(c => !c.parentId);
    const repliesFor = (id) => comments
        .filter(c => c.parentId === id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const renderCommentBody = (c, { isReply = false } = {}) => {
        const isOwner = isAuthenticated && user?.sub === c.userSub;
        const isEditing = editingId === c._id;

        return (
            <div className={`comment-item${isReply ? ' reply' : ''}`} key={c._id}>
                <img
                    className="comment-avatar"
                    src={c.picture}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.username || "User")}&background=0D8ABC&color=fff`;
                    }}
                />
                <div className="comment-body">
                    <div className="comment-meta">
                        <span className="comment-username">{c.username}</span>
                        <span className="comment-time">
                            {new Date(c.createdAt).toLocaleString()}
                            {c.editedAt && <em> · edited</em>}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="comment-edit-box">
                            <textarea
                                className="comment"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={4}
                                maxLength={1000}
                            ></textarea>
                            {editError && <div className="comment-error">{editError}</div>}
                            <div className="comment-edit-actions">
                                <button className="comment-action-btn save" onClick={() => saveEdit(c._id)} disabled={!editText.trim()}>Save</button>
                                <button className="comment-action-btn" onClick={cancelEdit}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="comment-text">{c.text}</div>
                            {(isOwner || (!isReply && isAuthenticated)) && (
                                <div className="comment-owner-actions">
                                    {!isReply && isAuthenticated && (
                                        <button className="comment-action-btn" onClick={() => startReply(c._id)}>Reply</button>
                                    )}
                                    {isOwner && (
                                        <>
                                            <button className="comment-action-btn" onClick={() => startEdit(c)}>Edit</button>
                                            <button className="comment-action-btn danger" onClick={() => setDeleteTarget(c._id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {!isReply && replyingTo === c._id && (
                        <div className="comment-reply-composer">
                            <CommentComposer
                                value={replyText}
                                onChange={setReplyText}
                                onSubmit={() => postReply(c._id)}
                                submitting={submittingReply}
                                placeholder={`Reply to ${c.username}...`}
                                autoFocus
                            />
                            {replyError && <div className="comment-error">{replyError}</div>}
                            <button className="comment-action-btn" onClick={cancelReply}>Cancel</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="comment-section">
            <label>Comments</label>

            {isAuthenticated ? (
                <div id="comments" name="comments">
                    <CommentComposer
                        value={text}
                        onChange={setText}
                        onSubmit={postComment}
                        submitting={submitting}
                        placeholder="Write your comment here..."
                    />
                    {error && <div className="comment-error">{error}</div>}
                </div>
            ) : (
                <div className="login-required">
                    Please <button className='loginbtn' onClick={() => {
                        const returnTo = window.location.pathname.replace(/^\/Couch-Critic/, "") || "/movie";
                        localStorage.setItem("auth_return_to", returnTo);
                        loginWithRedirect();
                    }}>Login</button> to comment.
                </div>
            )}

            <hr className="mt-3 mb-3" />

            {loading ? (
                <div className="no-comments-text">Loading comments...</div>
            ) : topLevelComments.length === 0 ? (
                <div className="no-comments-text">No Comments</div>
            ) : (
                <div className="comment-list">
                    {topLevelComments.map((c) => (
                        <div key={c._id}>
                            {renderCommentBody(c)}
                            {repliesFor(c._id).length > 0 && (
                                <div className="comment-replies">
                                    {repliesFor(c._id).map((r) => renderCommentBody(r, { isReply: true }))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {deleteTarget && (
                <div className="comment-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
                    <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="comment-modal-title">Delete this comment?</div>
                        <div className="comment-modal-text">This can't be undone.</div>
                        <div className="comment-modal-actions">
                            <button className="comment-modal-btn cancel" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
                            <button className="comment-modal-btn confirm" onClick={confirmDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}