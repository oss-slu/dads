import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, List, ListItem } from '@mui/material';

const ImprovementNotesCard = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');

  const handleAddNote = () => {
    if (input.trim() !== '') {
      setNotes([...notes, input.trim()]);
      setInput('');
    }
  };

  return (
    <Card sx={{ margin: 2, backgroundColor: '#f1f8e9' }}>
      <CardContent>
        <Typography variant="h6">📌 Improvement Notes</Typography>
        <TextField
          label="Add a note"
          variant="outlined"
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ marginTop: 2 }}
        />
        <Button variant="contained" sx={{ marginTop: 1 }} onClick={handleAddNote}>
          Add
        </Button>
        <List>
          {notes.map((note, index) => (
            <ListItem key={index}>{note}</ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ImprovementNotesCard;
