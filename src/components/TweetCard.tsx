import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Tag as HashIcon
} from '@mui/icons-material';

interface TweetData {
  content: string;
  timestamp: number;
  author: string;
  hash?: string;
}

interface TweetCardProps {
  tweet: TweetData;
  index: number;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, index }) => {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarColor = (author: string) => {
    // Generate a consistent color based on author name
    const colors = [
      '#1976d2', '#dc004e', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    const hash = author.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ 
      p: 2,
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        bgcolor: 'rgba(255, 255, 255, 0.03)'
      }
    }}>
      {/* Header with avatar and author info */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar 
          sx={{ 
            bgcolor: getAvatarColor(tweet.author),
            width: 40,
            height: 40,
            mr: 1.5,
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          {getInitials(tweet.author)}
        </Avatar>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700,
                mr: 1,
                color: 'text.primary'
              }}
            >
              {tweet.author}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              @{tweet.author.toLowerCase().replace(/\s+/g, '')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              · {formatTimestamp(tweet.timestamp)}
            </Typography>
          </Box>
          
          {/* Tweet content */}
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 1,
              lineHeight: 1.3,
              fontSize: '0.95rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: 'text.primary'
            }}
          >
            {tweet.content}
          </Typography>

          {/* Footer with metadata */}
          {tweet.hash && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mt: 1
            }}>
              <Chip
                icon={<HashIcon sx={{ fontSize: 12 }} />}
                label={`${tweet.hash.slice(0, 8)}...${tweet.hash.slice(-8)}`}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 24,
                  borderColor: 'divider',
                  color: 'text.secondary'
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TweetCard;
