import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  Paper,
  Typography 
} from '@mui/material';

function TaskList({ tasks, onToggleTask }) {
  if (tasks.length === 0) {
    return (
      <Typography variant="body1" align="center">
        No tasks yet! Add some tasks to get started.
      </Typography>
    );
  }

  return (
    <Paper elevation={2}>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            dense
            button
            onClick={() => onToggleTask(task.id)}
          >
            <Checkbox
              edge="start"
              checked={task.completed}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText
              primary={task.title}
              secondary={`Assigned to: ${task.assignee}`}
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default TaskList; 