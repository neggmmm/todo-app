// components/EditTaskForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Task } from "@/types"; // Assuming you have a types.ts file with your Task type

interface EditTaskFormProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  onCancel: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onUpdateTask, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [startDate, setStartDate] = useState(task.startDate || "");
  const [endDate, setEndDate] = useState(task.endDate || "");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(task.priority || "Low");

  const handleSave = () => {
    const updatedTask = {
      ...task,
      title,
      description,
      startDate,
      endDate,
      priority,
    };
    onUpdateTask(updatedTask);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Title</Label>
        <Input
          type="text"
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Input
          type="text"
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="edit-startDate">Start Date</Label>
          <Input
            id="edit-startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="edit-endDate">End Date</Label>
          <Input
            id="edit-endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-priority">Priority</Label>
        <Select
          id="edit-priority"
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
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default EditTaskForm;