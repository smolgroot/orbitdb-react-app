import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  GitHub as GitHubIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
          color: 'text.primary'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StorageIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="div" fontWeight="bold">
            About OrbitDB Twitter
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
          This demo showcases <strong>OrbitDB</strong> running in a React + TypeScript application 
          with a Twitter-like interface. OrbitDB is a peer-to-peer database powered by IPFS that 
          enables decentralized applications to store and sync data without centralized servers.
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          🚀 Technology Stack
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          flexWrap: 'wrap',
          mb: 3
        }}>
          <Chip
            label="📊 OrbitDB v2.5.0"
            sx={{ 
              bgcolor: '#1d9bf0',
              color: 'white',
              fontWeight: 500
            }}
          />
          <Chip
            label="⚛️ React 18"
            sx={{ 
              bgcolor: '#61dafb',
              color: '#000',
              fontWeight: 500
            }}
          />
          <Chip
            label="📘 TypeScript"
            sx={{ 
              bgcolor: '#3178c6',
              color: 'white',
              fontWeight: 500
            }}
          />
          <Chip
            label="🎨 Material-UI"
            sx={{ 
              bgcolor: '#007fff',
              color: 'white',
              fontWeight: 500
            }}
          />
          <Chip
            label="🌍 IPFS/Helia"
            sx={{ 
              bgcolor: '#65c2cb',
              color: 'white',
              fontWeight: 500
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          ✨ Features
        </Typography>
        
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Decentralized Storage:</strong> All tweets stored in OrbitDB without central servers
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Twitter-like UI:</strong> Familiar interface with dark theme
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Real-time Updates:</strong> Instant UI updates when posting tweets
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Offline Mode:</strong> Works without network connectivity
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Character Limits:</strong> Twitter-like 280 character limit
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Built with ❤️ using modern web technologies and decentralized protocols.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          href="https://github.com/orbitdb/orbitdb"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<GitHubIcon />}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          OrbitDB GitHub
        </Button>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ 
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutModal;
