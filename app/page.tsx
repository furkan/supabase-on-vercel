'use client'

import { useEffect, useState } from 'react'

interface Task {
  id: number
  title: string
  completed: boolean
  created_at: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle }),
      })
      if (!response.ok) throw new Error('Failed to add task')
      const data = await response.json()
      setTasks([data, ...tasks])
      setNewTaskTitle('')
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  async function updateTask(task: Task) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, completed: !task.completed }),
      })
      if (!response.ok) throw new Error('Failed to update task')
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  async function deleteTask(id: number) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) throw new Error('Failed to delete task')
      setTasks(tasks.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Task Manager</h1>
        
        <form onSubmit={addTask} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => updateTask(task)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 text-red-500 hover:text-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
