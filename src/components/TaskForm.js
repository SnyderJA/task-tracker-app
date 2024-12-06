import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !assignee.trim()) return;
    
    onAddTask({
      title,
      assignee,
    });
    
    setTitle('');
    setAssignee('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Assign To"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        margin="normal"
        required
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        sx={{ mt: 2 }}
      >
        Add Task
      </Button>
    </Box>
  );
}

export default TaskForm; 