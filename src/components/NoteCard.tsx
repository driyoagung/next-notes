import { INote } from '@/models/Note';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: INote & { _id: string };
  onEdit: (note: any) => void;
  onDelete: (note: any) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Personal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Work': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Ideas': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="flex flex-col h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold leading-tight line-clamp-1">{note.title}</CardTitle>
          <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            <Clock className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </div>
        </div>
        <Badge className={`ml-2 hover:bg-opacity-80 border-none ${getCategoryColor(note.category)}`}>
          {note.category}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap line-clamp-4 leading-relaxed">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="pt-3 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={() => onEdit(note)} className="h-8 px-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(note)} className="h-8 px-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
