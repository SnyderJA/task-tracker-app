import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  updateDoc
} from 'firebase/firestore';
import '../styles/TaskTracker.css';

function TaskTracker() {
  const [lists, setLists] = useState([
    { id: 'default', name: 'My Tasks', tasks: [], isDefault: true }
  ]);
  const [activeListId, setActiveListId] = useState('default');
  const [taskText, setTaskText] = useState('');
  const [newListName, setNewListName] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!currentUser) {
        navigate('/login');
      } else {
        try {
          await loadLists();
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkAuth();
  }, [currentUser, navigate]);

  async function loadLists() {
    if (!currentUser) return;
    
    try {
      const q = query(
        collection(db, 'lists'), 
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      const loadedLists = [
        { id: 'default', name: 'My Tasks', tasks: [], isDefault: true }
      ];

      querySnapshot.forEach((doc) => {
        loadedLists.push({ id: doc.id, ...doc.data() });
      });

      setLists(loadedLists);
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  }

  async function handleLogout() {
    try {
      setIsLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!taskText.trim()) return;

    try {
      console.log('Adding new task to list:', activeListId);
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
        userId: currentUser.uid
      };

      const updatedList = lists.find(list => list.id === activeListId);
      if (!updatedList) {
        console.error('Active list not found:', activeListId);
        return;
      }

      const updatedTasks = [...updatedList.tasks, newTask];

      if (!updatedList.isDefault) {
        const listRef = doc(db, 'lists', activeListId);
        await updateDoc(listRef, { tasks: updatedTasks });
        console.log('Task added to Firestore');
      }

      setLists(prevLists => 
        prevLists.map(list =>
          list.id === activeListId
            ? { ...list, tasks: updatedTasks }
            : list
        )
      );
      
      setTaskText('');
      console.log('Task added successfully');
    } catch (error) {
      console.error('Error in handleAddTask:', error);
    }
  }

  async function toggleTask(taskId) {
    const list = lists.find(list => list.id === activeListId);
    const updatedTasks = list.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    try {
      if (!list.isDefault) {
        await updateDoc(doc(db, 'lists', activeListId), {
          tasks: updatedTasks
        });
      }

      if (!list.tasks.find(t => t.id === taskId).completed) {
        setCompletingTaskId(taskId);
        setTimeout(() => {
          setCompletingTaskId(null);
        }, 500);
      }

      setLists(lists.map(l =>
        l.id === activeListId ? { ...l, tasks: updatedTasks } : l
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }

  async function deleteTask(taskId) {
    const list = lists.find(list => list.id === activeListId);
    const updatedTasks = list.tasks.filter(task => task.id !== taskId);

    try {
      if (!list.isDefault) {
        await updateDoc(doc(db, 'lists', activeListId), {
          tasks: updatedTasks
        });
      }

      setLists(lists.map(l =>
        l.id === activeListId ? { ...l, tasks: updatedTasks } : l
      ));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  async function handleAddList(e) {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const newList = {
        id: Date.now().toString(),
        name: newListName,
        tasks: [],
        isDefault: false,
        userId: currentUser.uid
      };

      // Add to Firestore
      await setDoc(doc(db, 'lists', newList.id), newList);

      // Update local state
      setLists(prevLists => [...prevLists, newList]);
      setNewListName('');
      setIsAddingList(false);
      setActiveListId(newList.id);

    } catch (error) {
      console.error('Error adding list:', error);
    }
  }

  async function handleDeleteList(listId) {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'lists', listId));

      // Update local state
      setLists(prevLists => prevLists.filter(list => list.id !== listId));
      
      // If the deleted list was active, switch to default list
      if (activeListId === listId) {
        setActiveListId('default');
      }

    } catch (error) {
      console.error('Error deleting list:', error);
    }
  }

  // If loading or not logged in, show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not logged in, don't render anything (redirect will happen via useEffect)
  if (!currentUser) {
    return null;
  }

  const activeList = lists.find(list => list.id === activeListId) || lists[0];

  return (
    <div className="app-container">
      <div className="lists-sidebar">
        <button 
          className="new-list-button"
          onClick={() => setIsAddingList(true)}
        >
          New List
        </button>
        
        {isAddingList && (
          <form onSubmit={handleAddList}>
            <input
              type="text"
              className="list-input"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              autoFocus
            />
          </form>
        )}

        {lists.map(list => (
          <div
            key={list.id}
            className={`list-item ${activeListId === list.id ? 'active' : ''}`}
            onClick={() => setActiveListId(list.id)}
          >
            <span className="list-name">{list.name}</span>
            {!list.isDefault && (
              <svg
                className="list-delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList(list.id);
                }}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            )}
          </div>
        ))}
      </div>

      <div className="main-content">
        <div className="header-container">
          <div className="list-header">
            <h2 className="list-title">{activeList.name}</h2>
          </div>
          <div className="user-section">
            <span>{currentUser.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        {!activeList.isDefault && (
          <form onSubmit={handleAddTask} className="task-form">
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Add a new task"
              className="task-input"
            />
            <button type="submit" className="add-button">
              Add Task
            </button>
          </form>
        )}

        <div className="task-list">
          {activeList.tasks.length === 0 ? (
            <div className="no-tasks">No tasks yet. Add one to get started!</div>
          ) : (
            activeList.tasks.map(task => (
              <div 
                key={task.id} 
                className={`task-item ${completingTaskId === task.id ? 'completing' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                <span className={`task-text ${task.completed ? 'task-completed' : ''}`}>
                  {task.text}
                </span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskTracker; 