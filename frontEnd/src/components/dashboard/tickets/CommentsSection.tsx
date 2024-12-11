// CommentsSection.tsx

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { AuthContext, AuthContextType } from "../../../contexts/AuthProvider";
import DataTable from "../../../hooks/DataTable"; // Import our DataTable hook
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
  const [refresh, setRefresh] = useState<boolean>(false); // For reloading the data after adding a comment

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/tickets/${ticketId}/comments`,
        { withCredentials: true }
      );
      // Sort comments by created_at descending before setting state
      const sortedComments = response.data.sort(
        (a: Comment, b: Comment) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId, refresh]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/tickets/${ticketId}/comments`,
        { comment: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Define columns for the DataTable
  const columns = [
    {
      header: "Commenter",
      accessor: "commenter_username",
      type: "string" as const,
    },
    { header: "Comment", accessor: "comment", type: "string" as const },
    { header: "Date", accessor: "created_at", type: "date" as const },
  ];

  const renderCell = (item: Comment, accessor: string) => {
    if (accessor === "created_at") {
      return formatDate(item.created_at);
    }
    return item[accessor as keyof Comment];
  };

  return (
    <div className="comments-section">
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
          <DataTable
            endpoint=""
            columns={columns}
            searchFields={["commenter_username", "comment"]}
            refresh={refresh}
            renderCell={renderCell}
            staticData={comments}
          />
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
