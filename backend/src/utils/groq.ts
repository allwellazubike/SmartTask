import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Uses Llama-3.1-8b-instant to parse a command string into a JSON object 
 * containing title, due_date, and category.
 */
export async function parseTaskCommand(input: string) {
  const prompt = `You are a productivity AI. Parse the following user command into a strictly formatted JSON object with no markdown wrappers or extra text.
Extract the following fields:
- title (string): A short, actionable task name.
- due_date (string, ISO 8601 format, or null if unstated. Assume year is ${new Date().getFullYear()} if missing.)
- category (string, e.g., "Work", "Personal", "Study", or null if unclear)
- importance (number, 1-10, guess based on context)
- urgency (number, 1-10, guess based on urgency words/deadlines)

User command: "${input}"
JSON output:`

  const response = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-8b-instant',
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Failed to parse task command");
  
  return JSON.parse(content);
}

/**
 * Uses Llama-3.3-70b-versatile to generate a breakdown of 3-5 sub-tasks 
 * based on the task title and description.
 */
export async function generateTaskBreakdown(taskTitle: string, taskDescription: string | null) {
  const descString = taskDescription ? `\nDescription: ${taskDescription}` : '';
  const prompt = `You are an expert project manager. Break down the following task into 3 to 5 actionable sub-tasks.
Return ONLY a valid JSON object containing an array called "subtasks". Each item should have a "title" (string) and "completed" (boolean, false). No markdown wrappers.

Task Title: ${taskTitle}${descString}
JSON output:`;

  const response = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Failed to generate breakdown");
  
  return JSON.parse(content);
}
