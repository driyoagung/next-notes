import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: any) => Promise<void>;
  initialData?: any;
}

export default function NoteDialog({ isOpen, onClose, onSave, initialData }: NoteDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategory(initialData.category);
    } else if (!initialData && isOpen) {
      setTitle('');
      setContent('');
      setCategory('Other');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...(initialData?._id ? { _id: initialData._id } : {}),
        title,
        content,
        category,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save note', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details of your note below.' : 'Fill in the details for your new note.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
          <div className="space-y-2.5">
            <label htmlFor="title" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Title
            </label>
            <Input
              id="title"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className="focus-visible:ring-indigo-500"
            />
          </div>
          <div className="space-y-2.5">
            <label htmlFor="category" className="text-sm font-medium leading-none text-foreground">
              Category
            </label>
            <Select value={category} onValueChange={(val) => setCategory(val || 'Other')}>
              <SelectTrigger className="focus:ring-indigo-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Ideas">Ideas</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <label htmlFor="content" className="text-sm font-medium leading-none text-foreground">
              Content
            </label>
            <Textarea
              id="content"
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              className="resize-none focus-visible:ring-indigo-500"
            />
          </div>
          <DialogFooter className="pt-6 sm:space-x-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim() || isSubmitting} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
