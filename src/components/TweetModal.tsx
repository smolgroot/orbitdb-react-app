import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon
} from '@mui/icons-material';

interface TweetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tweetData: {
    content: string;
    timestamp: number;
    author: string;
  }) => Promise<void>;
}

const TweetModal: React.FC<TweetModalProps> = ({ open, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Anonymous');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxLength = 280; // Twitter-like character limit
  const remainingChars = maxLength - content.length;

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Tweet content cannot be empty');
      return;
    }

    if (content.length > maxLength) {
      setError(`Tweet is too long. Maximum ${maxLength} characters allowed.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        content: content.trim(),
        timestamp: Date.now(),
        author: author.trim() || 'Anonymous'
      });
      
      // Reset form
      setContent('');
      setAuthor('Anonymous');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post tweet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setContent('');
      setAuthor('Anonymous');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 400,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Compose tweet
        </Typography>
        <IconButton 
          onClick={handleClose} 
          disabled={isSubmitting}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.default' }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Your name"
          disabled={isSubmitting}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        <TextField
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={4}
          disabled={isSubmitting}
          variant="outlined"
          sx={{ 
            mb: 1,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiInputBase-input': {
              fontSize: '1.2rem',
            }
          }}
        />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 1
        }}>
          <Typography 
            variant="body2" 
            color={remainingChars < 0 ? 'error' : remainingChars < 20 ? 'warning.main' : 'text.secondary'}
          >
            {remainingChars} characters remaining
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            {content.length}/{maxLength}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
          variant="outlined"
          sx={{ 
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'primary.main'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim() || content.length > maxLength}
          variant="contained"
          sx={{ 
            minWidth: 120,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 'bold',
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark'
            },
            '&:disabled': {
              bgcolor: 'action.disabled'
            }
          }}
        >
          {isSubmitting ? 'Posting...' : 'Tweet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TweetModal;
