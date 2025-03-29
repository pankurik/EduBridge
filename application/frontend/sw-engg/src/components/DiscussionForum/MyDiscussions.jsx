import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import apiService from '../../services/apiService';

const MyDiscussions = () => {
    const [discussions, setDiscussions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedText, setEditedText] = useState('');
    const [discussionToEdit, setDiscussionToEdit] = useState(null);
    const [discussionToDelete, setDiscussionToDelete] = useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyDiscussionsFromApi();
    }, []);

    const fetchMyDiscussionsFromApi = async () => {
        const userEmail = sessionStorage.getItem('userEmail');
        try {
            const response = await apiService.fetchMyDiscussions(userEmail);
            if (response && response.discussion && response.replies) {
                const discussionsWithRepliesCount = response.discussion.map(discussion => {
                    const repliesCount = response.replies.filter(reply => reply.discussion_id === discussion.id).length;
                    return {...discussion, repliesCount};
                });
                setDiscussions(discussionsWithRepliesCount);
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };

    const confirmDeleteDiscussion = (discussion, event) => {
        event.stopPropagation();
        setDiscussionToDelete(discussion);
        setIsConfirmDialogOpen(true);
    };

    const deleteDiscussion = async () => {
        try {
            await apiService.deleteDiscussion(discussionToDelete.id);
            setDiscussions(discussions.filter((discussion) => discussion.id !== discussionToDelete.id));
            setIsConfirmDialogOpen(false);
            setDiscussionToDelete(null);
        } catch (error) {
            console.error('Error deleting discussion:', error);
        }
    };

    const handleEditClick = (discussion, event) => {
        event.stopPropagation();
        setIsEditing(true);
        setEditedTitle(discussion.title);
        setEditedText(discussion.content);
        setDiscussionToEdit(discussion);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedTitle('');
        setEditedText('');
        setDiscussionToEdit(null);
    };

    const handleSaveEdit = async () => {
        const userEmail = sessionStorage.getItem('userEmail');
        try {
            await apiService.updateDiscussion(discussionToEdit.id, editedTitle, editedText, userEmail);
            await fetchMyDiscussionsFromApi();


            handleCancelEdit();
        } catch (error) {
            console.error('Error updating discussion:', error);
        }
    };

    const handleDiscussionClick = (id) => {
        if (!isEditing) {
            navigate(`/discussion/${id}`);
        }
    };

    return (
        <Box sx={{maxWidth: 800, margin: 'auto', mt: 2}}>
            {discussions.map((discussion) => (
                <Paper key={discussion.id} elevation={2} sx={{p: 2, mb: 2}}
                       onClick={() => handleDiscussionClick(discussion.id)}>
                    {isEditing && discussion.id === discussionToEdit.id ? (
                        <>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Title"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                sx={{mb: 2}}
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                label="Content"
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                sx={{mb: 2}}
                            />
                            <Button startIcon={<SaveIcon/>} onClick={handleSaveEdit} color="primary">Save</Button>
                            <Button startIcon={<CancelIcon/>} onClick={handleCancelEdit}
                                    color="secondary">Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" sx={{
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                {discussion.title}
                                <Box>
                                    <IconButton onClick={(e) => handleEditClick(discussion, e)}><EditIcon/></IconButton>
                                    <IconButton
                                        onClick={(e) => confirmDeleteDiscussion(discussion, e)}><DeleteIcon/></IconButton>
                                </Box>
                            </Typography>
                            <Typography variant="body2" sx={{mb: 2}}>{discussion.content}</Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <ThumbUpAltIcon sx={{mr: 0.5, color: 'primary.main'}}/>
                                <Typography sx={{mx: 2}}>{discussion.likes}</Typography>
                                <ThumbDownAltIcon sx={{mr: 0.5, color: 'secondary.main'}}/>
                                <Typography sx={{mx: 2}}>{discussion.dislikes}</Typography>
                                <CommentIcon sx={{ml: 2, mr: 0.5, color: 'action.active'}}/>
                                <Typography>{discussion.repliesCount}</Typography>
                            </Box>
                        </>
                    )}
                </Paper>
            ))}
            <Dialog
                open={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this discussion?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={deleteDiscussion} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyDiscussions;
