import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { adminAPI } from '../../../services/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  replied: boolean;
  createdAt: string;
}

const ContactViewer: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const statusParam = filterStatus === 'all' ? undefined : filterStatus;
      const response = await adminAPI.getContacts(statusParam);
      if (response.data.success) {
        setContacts(response.data.data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setMessage({ type: 'error', text: 'Failed to load contact messages' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);

    // Mark as read if it's new
    if (contact.status === 'new') {
      try {
        await adminAPI.updateContactStatus(contact._id, { status: 'read' });
        loadContacts();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedContact(null);
  };

  const handleStatusChange = async (id: string, status: string, replied: boolean = false) => {
    try {
      await adminAPI.updateContactStatus(id, { status, replied });
      setMessage({ type: 'success', text: 'Status updated successfully!' });
      loadContacts();
      if (selectedContact && selectedContact._id === id) {
        handleCloseDialog();
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await adminAPI.deleteContact(id);
      setMessage({ type: 'success', text: 'Message deleted successfully!' });
      loadContacts();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'error';
      case 'read': return 'warning';
      case 'replied': return 'success';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading && contacts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Contact Messages ({contacts.length})
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filter"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="replied">Replied</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id} hover>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.subject}</TableCell>
                <TableCell>{formatDate(contact.createdAt)}</TableCell>
                <TableCell>
                  <Chip 
                    label={contact.status} 
                    color={getStatusColor(contact.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => handleViewContact(contact)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(contact._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {contacts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="body1" color="text.secondary">
            No contact messages found.
          </Typography>
        </Box>
      )}

      {/* View Contact Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Contact Message
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">From:</Typography>
                <Typography variant="body1">{selectedContact.name}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
                <Typography variant="body1">{selectedContact.email}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Subject:</Typography>
                <Typography variant="body1">{selectedContact.subject}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Date:</Typography>
                <Typography variant="body1">{formatDate(selectedContact.createdAt)}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Status:</Typography>
                <Chip 
                  label={selectedContact.status} 
                  color={getStatusColor(selectedContact.status)} 
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Message:</Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedContact.message}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedContact && (
            <>
              <Button 
                onClick={() => handleStatusChange(selectedContact._id, 'replied', true)}
                variant="outlined"
                color="success"
              >
                Mark as Replied
              </Button>
              <Button 
                onClick={() => handleStatusChange(selectedContact._id, 'archived')}
                variant="outlined"
              >
                Archive
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ContactViewer;

