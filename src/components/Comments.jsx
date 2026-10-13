import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaPaperPlane } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { API } from '../api';

const VISIBLE_REPLIES = 2;

function useAutoGrow(ref, value, maxHeight) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
    }, [value, maxHeight]);
}

function AutoGrowTextarea({ value, onChange, onKeyDown, placeholder, autoFocus, maxHeight = 1600 }) {
    const ref = useRef(null);
    useAutoGrow(ref, value, maxHeight);

    return (
        <textarea
            ref={ref}
            className="comment"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            autoFocus={autoFocus}
            style={{ maxHeight: `${maxHeight}px` }}
        ></textarea>
    );
}

function CommentComposer({ value, onChange, onSubmit, submitting, placeholder, autoFocus, maxHeight }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !submitting) onSubmit();
        }
    };

    return (
        <div className="comment-composer">
            <AutoGrowTextarea
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoFocus={autoFocus}
                maxHeight={maxHeight}
            />
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

function CommentItem({ comment, isReply, replies = [], currentUserSub, isAuthenticated, onSubmitReply, onSubmitEdit, onRequestDelete }) {
    const isOwner = isAuthenticated && currentUserSub === comment.userSub;

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [editError, setEditError] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyError, setReplyError] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const [showAllReplies, setShowAllReplies] = useState(false);

    const startEdit = () => {
        setEditText(comment.text);
        setEditError('');
        setIsEditing(true);
    };

    const saveEdit = async () => {
        if (!editText.trim()) return;
        setSavingEdit(true);
        setEditError('');
        try {
            await onSubmitEdit(comment._id, editText);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to edit comment:', err.message);
            setEditError('Failed to save changes. Please try again.');
        } finally {
            setSavingEdit(false);
        }
    };

    const submitReply = async () => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        setReplyError('');
        try {
            await onSubmitReply(comment._id, replyText);
            setIsReplying(false);
            setReplyText('');
        } catch (err) {
            console.error('Failed to post reply:', err.message);
            setReplyError('Failed to post reply. Please try again.');
        } finally {
            setSubmittingReply(false);
        }
    };

    const visibleReplies = showAllReplies ? replies : replies.slice(0, VISIBLE_REPLIES);
    const hiddenCount = replies.length - visibleReplies.length;

    return (
        <div>
            <div className={`comment-item${isReply ? ' reply' : ''}`}>
                <img
                    className="comment-avatar"
                    src={comment.picture}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username || "User")}&background=0D8ABC&color=fff`;
                    }}
                />
                <div className="comment-body">
                    <div className="comment-meta">
                        <span className="comment-username">{comment.username}</span>
                        <span className="comment-time">
                            {new Date(comment.createdAt).toLocaleString()}
                            {comment.editedAt && <em> · edited</em>}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="comment-edit-box">
                            <AutoGrowTextarea value={editText} onChange={setEditText} maxHeight={200} />
                            {editError && <div className="comment-error">{editError}</div>}
                            <div className="comment-edit-actions">
                                <button className="comment-action-btn save" onClick={saveEdit} disabled={!editText.trim() || savingEdit}>
                                    {savingEdit ? "Saving..." : "Save"}
                                </button>
                                <button className="comment-action-btn" onClick={() => setIsEditing(false)} disabled={savingEdit}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="comment-text">{comment.text}</div>
                            {(isOwner || (!isReply && isAuthenticated)) && (
                                <div className="comment-owner-actions">
                                    {!isReply && isAuthenticated && (
                                        <button className="comment-action-btn" onClick={() => setIsReplying(prev => !prev)}>
                                            {isReplying ? "Cancel" : "Reply"}
                                        </button>
                                    )}
                                    {isOwner && (
                                        <>
                                            <button className="comment-action-btn" onClick={startEdit}>Edit</button>
                                            <button className="comment-action-btn danger" onClick={() => onRequestDelete(comment._id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {!isReply && isReplying && (
                        <div className="comment-reply-composer">
                            <CommentComposer
                                value={replyText}
                                onChange={setReplyText}
                                onSubmit={submitReply}
                                submitting={submittingReply}
                                placeholder={`Reply to ${comment.username}...`}
                                autoFocus
                            />
                            {replyError && <div className="comment-error">{replyError}</div>}
                        </div>
                    )}
                </div>
            </div>

            {!isReply && replies.length > 0 && (
                <div className="comment-replies">
                    {visibleReplies.map((r) => (
                        <CommentItem
                            key={r._id}
                            comment={r}
                            isReply
                            currentUserSub={currentUserSub}
                            isAuthenticated={isAuthenticated}
                            onSubmitEdit={onSubmitEdit}
                            onRequestDelete={onRequestDelete}
                        />
                    ))}
                    {hiddenCount > 0 && (
                        <button className="comment-action-btn see-more" onClick={() => setShowAllReplies(true)}>
                            See {hiddenCount} more {hiddenCount === 1 ? 'reply' : 'replies'}
                        </button>
                    )}
                    {showAllReplies && replies.length > VISIBLE_REPLIES && (
                        <button className="comment-action-btn see-more" onClick={() => setShowAllReplies(false)}>
                            Hide replies
                        </button>
                    )}
                </div>
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

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchComments = useCallback(async () => {
        if (!itemType || !itemId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API}/comments/${itemType}/${itemId}`);
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
            const res = await axios.post(`${API}/comments`, {
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

    const submitReply = async (parentId, replyText) => {
        const token = await getAccessTokenSilently();
        const res = await axios.post(`${API}/comments`, {
            itemId, itemType, text: replyText.trim(), parentId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setComments(prev => [...prev, res.data]);
    };

    const submitEdit = async (id, newText) => {
        const token = await getAccessTokenSilently();
        const res = await axios.patch(`${API}/comments/${id}`, {
            text: newText.trim()
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setComments(prev => prev.map(c => c._id === id ? res.data : c));
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const token = await getAccessTokenSilently();
            await axios.delete(`${API}/comments/${deleteTarget}`, {
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
                        <CommentItem
                            key={c._id}
                            comment={c}
                            replies={repliesFor(c._id)}
                            currentUserSub={user?.sub}
                            isAuthenticated={isAuthenticated}
                            onSubmitReply={submitReply}
                            onSubmitEdit={submitEdit}
                            onRequestDelete={setDeleteTarget}
                        />
                    ))}
                </div>
            )}

            {deleteTarget && createPortal(
                <div className="comment-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
                    <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="comment-modal-title">Delete this comment?</div>
                        <div className="comment-modal-text">This can't be undone. Any replies will be deleted too.</div>
                        <div className="comment-modal-actions">
                            <button className="comment-modal-btn cancel" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
                            <button className="comment-modal-btn confirm" onClick={confirmDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}