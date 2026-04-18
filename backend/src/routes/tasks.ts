import { Router } from 'express';
import prisma from '../utils/prisma';
import { parseTaskCommand, generateTaskBreakdown } from '../utils/groq';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// POST /api/tasks/parse
router.post('/parse', async (req: AuthRequest, res) => {
  try {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: 'Command string is required' });

    // 1. Call Groq
    const parsedData = await parseTaskCommand(command);

    // 2. Parse dates / default values
    let dueDate = null;
    if (parsedData.due_date) {
      const parsedDate = new Date(parsedData.due_date);
      if (!isNaN(parsedDate.getTime())) {
        dueDate = parsedDate;
      }
    }

    // 3. Save to database
    const task = await prisma.task.create({
      data: {
        title: parsedData.title || command,
        due_date: dueDate,
        category: parsedData.category || 'Uncategorized',
        importance: parsedData.importance || 5, // default to 5
        urgency: parsedData.urgency || 5, // default to 5
        user_id: req.userId!
      }
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    console.error('Task parsing error:', error);
    res.status(500).json({ error: 'Failed to parse and create task' });
  }
});

// GET /api/tasks/focus
router.get('/focus', async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: req.userId!,
        is_completed: false
      }
    });

    const now = new Date();
    
    const tasksWithScore = tasks.map(task => {
      const importance = task.importance || 5;
      const urgency = task.urgency || 5;
      
      let timeRemaining = 1; // Base denominator if no due date
      
      if (task.due_date) {
        const diffHours = (task.due_date.getTime() - now.getTime()) / (1000 * 60 * 60);
        // If overdue or less than 1 hour away, clamp denominator to something small to boost priority heavily
        timeRemaining = diffHours > 0 ? diffHours : 0.1; 
      } else {
        // No due date = standard time scale (e.g. 72 hours denominator fallback to normalize it lower)
        timeRemaining = 72;
      }
      
      const priorityScore = (importance * urgency) / timeRemaining;
      
      return { ...task, priorityScore };
    });

    // Sort descending by priority score
    tasksWithScore.sort((a, b) => b.priorityScore - a.priorityScore);

    res.json(tasksWithScore);
  } catch (error) {
    console.error('Focus tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch focus tasks' });
  }
});

// POST /api/tasks/:id/breakdown
router.post('/:id/breakdown', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const task = await prisma.task.findUnique({
      where: { id, user_id: req.userId! }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    const breakdownResult = await generateTaskBreakdown(task.title, task.description);
    
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        breakdown: breakdownResult.subtasks
      }
    });

    res.json({ message: 'Breakdown generated', task: updatedTask });
  } catch (error) {
    console.error('Task breakdown error:', error);
    res.status(500).json({ error: 'Failed to generate task breakdown' });
  }
});

// PATCH /api/tasks/:id/complete
router.patch('/:id/complete', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // update task
    const updatedTask = await prisma.task.updateMany({
      where: { id, user_id: req.userId! },
      data: {
        is_completed: true,
        completed_at: new Date()
      }
    });

    if (updatedTask.count === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task marked as completed' });
  } catch (error) {
    console.error('Task complete error:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

export default router;
