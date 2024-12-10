// CommentsSection.tsx

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { AuthContext, AuthContextType } from "../../../contexts/AuthProvider";
import "../../../styles/dashboard/CommentsSection.scss";

interface Comment {
  id: number;
  comment: string;
  created_at: string;
  user_id: number;
  commenter_username: string;
}

interface CommentsSectionProps {
  ticketId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ ticketId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(AuthContext) as AuthContextType;

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/tickets/${ticketId}/comments`,
        { withCredentials: true }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/tickets/${ticketId}/comments`,
        { comment: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="comments-section mt-4">
      <h3>Comments</h3>
      <Form.Group controlId="newComment">
        <Form.Label>Add a Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
        />
      </Form.Group>
      <Button variant="primary" onClick={handleAddComment} className="mt-2">
        Add Comment
      </Button>
      <div className="comments-list mt-3">
        {comments.length === 0 ? (
          <p className="fst-italic">No comments yet for this post</p>
        ) : (
          <ListGroup variant="flush">
            {comments.map((comment) => (
              <ListGroup.Item key={comment.id}>
                <strong>{comment.commenter_username}</strong>{" "}
                <span className="text-muted">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
                <p>{comment.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
