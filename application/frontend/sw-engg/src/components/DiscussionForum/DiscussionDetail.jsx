import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import apiService from '../../services/apiService';
import {Box, Button, Divider, IconButton, Paper, TextField, Typography} from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CommentIcon from '@mui/icons-material/Comment';

const DiscussionDetail = () => {
    const [discussion, setDiscussion] = useState({title: '', content: '', likes: 0, dislikes: 0});
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [error, setError] = useState('');
    const {id} = useParams();

    useEffect(() => {
        fetchDiscussionDetails();
    }, [id]);

    const fetchDiscussionDetails = async () => {
        try {
            const data = await apiService.fetchDiscussionDetail(id);
            setDiscussion(data.data.discussion);
            setReplies(data.data.replies);
        } catch (error) {
            console.error('Error fetching discussion details:', error);
            setError('Failed to fetch discussion details.');
        }
    };


    const handleReplyChange = (event) => {
        setNewReply(event.target.value);
        setError('');
    };

    const handleLike = async () => {
        try {
            const userId = sessionStorage.getItem('userEmail');
            await apiService.handleLike(id, userId);
            await fetchDiscussionDetails();
        } catch (error) {
            console.error('Error updating like:', error);
            setError('Failed to update like.');
        }
    };

    const handleDislike = async () => {
        try {
            const userId = sessionStorage.getItem('userEmail');
            await apiService.dislikeDiscussion(id, userId);
            await fetchDiscussionDetails();
        } catch (error) {
            console.error('Error updating dislike:', error);
            setError('Failed to update dislike.');
        }
    };


    const handleReplySubmit = async () => {
        if (!newReply.trim()) {
            setError('Reply cannot be empty.');
            return;
        }
        try {
            await apiService.postReply(id, newReply);
            await fetchDiscussionDetails();
            setNewReply('');
            setError('');
        } catch (error) {
            console.error('Error submitting reply:', error);
            setError('Failed to submit reply.');
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', p: 2 }}>
            <Button onClick={() => window.history.back()} sx={{ color: 'primary.main', textTransform: 'none', minWidth: 0 }}>
                <ArrowBackIcon sx={{ ml: -1 }} />
            </Button>
            <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ mb: 1 }}>{discussion.title}</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{discussion.content}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Button onClick={handleLike} sx={{ color: 'primary.main', textTransform: 'none', minWidth: 0 }}>
                        <ThumbUpAltIcon sx={{ mr: 0.5 }} />
                    </Button>
                    <Typography sx={{ mx: 2 }}>{discussion.likes}</Typography>
                    <Button onClick={handleDislike} sx={{ color: 'secondary.main', textTransform: 'none', minWidth: 0 }}>
                        <ThumbDownAltIcon sx={{ mr: 0.5 }} />
                    </Button>
                    <Typography sx={{ mx: 2 }}>{discussion.dislikes}</Typography>
                    <IconButton sx={{ color: 'action.active', textTransform: 'none', minWidth: 0, ml: 2 }}>
                        <CommentIcon />
                        <Typography sx={{ ml: 1 }}>{replies.length}</Typography>
                    </IconButton>
                </Box>
                <Divider sx={{ my: 2 }} />
                {replies.map((reply, index) => (
                    <Typography key={index} sx={{ mt: 1 }}>{reply.content}</Typography>
                ))}
                <TextField
                    fullWidth
                    label="Add a reply"
                    variant="outlined"
                    value={newReply}
                    onChange={handleReplyChange}
                    sx={{ mt: 2, mb: 2 }}
                    error={!!error}
                    helperText={error}
                />
                <Button variant="contained" onClick={handleReplySubmit}>Post Reply</Button>
            </Paper>
        </Box>
    );
};

export default DiscussionDetail;