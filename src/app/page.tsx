'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Task = {
  id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  completed: boolean;
  editing?: boolean;
  priority?: "Low" | "Medium" | "High";
};

export default function TodoApp() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleAddTask = () => {
    if (title.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      startDate,
      endDate,
      priority,
      completed: false,
      editing: false,
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setPriority("Low");
  };

  const handleDelete = (id: string) => {
    setTaskToDelete(id);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  const handleComplete = (id: string) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

 const handleToggleEditing = (id: string) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditingTask({ ...taskToEdit }); // Set the task being edited
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const searchedTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDueDatePassed = (endDate?: string) => {
    if (!endDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return endDate < today;
  };

  const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="bg-black">
    <div className="p-4 max-w-2xl mx-auto min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 bg-black shadow-md p-4 rounded-lg mb-6 z-10 border border-gray-300">
        <h1 className="text-3xl font-bold text-white text-center">TODO App</h1>
        <p className="text-gray-600 text-center">
          Total Tasks: {tasks.length} | Completed: {tasks.filter((task) => task.completed).length}
        </p>
      </header>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto">
        {/* Add Task Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>Create a new task to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <div className="flex gap-3">
                <div className="w-1/2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                  />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                  />
                </div>
              </div>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as "Low" | "Medium" | "High")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddTask} className="bg-black hover:bg-white hover:text-black border border-gray-300 w-full">
              Add Task
            </Button>
          </CardFooter>
        </Card>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters and Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
              />
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear
              </Button>
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as "all" | "active" | "completed")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="space-y-4">
        {searchedTasks.map((task) => (
  <Card key={task.id}>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span className={task.completed ? "line-through text-gray-500" : "text-gray-900"}>
          {task.title}
        </span>
        <span className={`px-2 py-1 rounded text-sm text-white ${getPriorityColor(task.priority!)}`}>
          {task.priority}
        </span>
      </CardTitle>
      <CardDescription className={task.completed ? "line-through" : ""}>
        {task.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      {editingTask?.id === task.id ? (
        // Render edit form if the task is being edited
        <EditTaskForm
          task={task}
          onUpdateTask={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      ) : (
        // Render task details otherwise
        <>
          {task.startDate && (
            <p className="text-sm text-gray-500">Start: {task.startDate}</p>
          )}
          {task.endDate && (
            <p className={`text-sm ${isDueDatePassed(task.endDate) ? "text-red-500" : "text-gray-500"}`}>
              End: {task.endDate} {isDueDatePassed(task.endDate) && "⚠️ Overdue"}
            </p>
          )}
        </>
      )}
    </CardContent>
    <CardFooter className="flex gap-2">
      <Button
        onClick={() => handleComplete(task.id)}
        variant={task.completed ? "outline" : "default"}
      >
        {task.completed ? "Undo" : "Complete"}
      </Button>
      {editingTask?.id !== task.id ? (
        <Button onClick={() => handleToggleEditing(task.id)} variant="outline">
          Edit
        </Button>
      ) : null}
      <Button onClick={() => handleDelete(task.id)} variant="destructive">
        Delete
      </Button>
    </CardFooter>
  </Card>
))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Are you sure you want to delete this task?</CardTitle>
            </CardHeader>
            <CardFooter className="flex gap-2">
              <Button onClick={confirmDelete} variant="destructive">
                Yes
              </Button>
              <Button onClick={cancelDelete} variant="outline">
                No
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
    </div>
  );
}