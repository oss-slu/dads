import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button,
  List, ListItem, IconButton, Box, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

const ImprovementNotesCard = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');

  const handleAddNote = () => {
    if (input.trim() !== '') {
      const newNote = {
        text: input.trim(),
        timestamp: new Date().toISOString()
      };
      setNotes([newNote, ...notes]); 
      setInput('');
    }
  };

  const handleDelete = (indexToRemove) => {
    const updated = notes.filter((_, i) => i !== indexToRemove);
    setNotes(updated);
  };

  return (
    <Card sx={{ margin: 2, backgroundColor: '#f1f8e9' }}>
      <CardContent>
        <Typography variant="h6">📌 Improvement Notes</Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField
            label="Add a note"
            variant="outlined"
            size="small"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddNote}>
            Add
          </Button>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        <List>
          {notes.map((note, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                backgroundColor: index === 0 ? '#dcedc8' : 'inherit',
                borderRadius: 1,
                mb: 1,
                paddingY: 1
              }}
            >
              <Box>
                <Typography variant="body1">{note.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {moment(note.timestamp).fromNow()}
                </Typography>
              </Box>
              <IconButton edge="end" onClick={() => handleDelete(index)} aria-label="delete">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ImprovementNotesCard;
