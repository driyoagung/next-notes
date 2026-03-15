"use client";

import { useState, useEffect, useCallback } from 'react';
import { INote } from '@/models/Note';
import NoteCard from '@/components/NoteCard';
import NoteDialog from '@/components/NoteDialog';
import DeleteDialog from '@/components/DeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Loader2 } from 'lucide-react';

export default function Home() {
  const [notes, setNotes] = useState<(INote & { _id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  // Dialog States
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Notes
  const fetchNotes = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      if (category && category !== 'All') queryParams.append('category', category);

      const res = await fetch(`/api/notes?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handlers
  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsNoteDialogOpen(true);
  };

  const handleEdit = (note: any) => {
    setSelectedNote(note);
    setIsNoteDialogOpen(true);
  };

  const handleDeleteClick = (note: any) => {
    setSelectedNote(note);
    setIsDeleteDialogOpen(true);
  };

  const handeSaveNote = async (noteData: any) => {
    const url = noteData._id ? `/api/notes/${noteData._id}` : '/api/notes';
    const method = noteData._id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });

    if (res.ok) {
      fetchNotes();
    } else {
      throw new Error('Failed to save note');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedNote) return;

    try {
      const res = await fetch(`/api/notes/${selectedNote._id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedNote(null);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  return (
    <main className="min-h-screen pb-12">
      {/* Premium Header */}
      <div className="bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800/50 backdrop-blur-md sticky top-0 z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Notes
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Capture and organize your thoughts.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                  placeholder="Search notes..." 
                  className="pl-9 bg-zinc-100/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={category} onValueChange={(val) => setCategory(val || 'All')}>
                  <SelectTrigger className="w-full sm:w-36 bg-zinc-100/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Ideas">Ideas</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleCreateNew} 
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4 mr-1.5" /> New Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-60">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading your thoughts...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Search className="h-8 w-8 text-indigo-300 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No notes found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
              {searchQuery || category !== 'All' 
                ? "We couldn't find any notes matching your search or filter criteria." 
                : "You haven't created any notes yet. Start capturing your ideas!"}
            </p>
            {(!searchQuery && category === 'All') && (
              <Button onClick={handleCreateNew} variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30">
                Create First Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard 
                key={note._id} 
                note={note} 
                onEdit={handleEdit} 
                onDelete={handleDeleteClick} 
              />
            ))}
          </div>
        )}
      </div>

      <NoteDialog 
        isOpen={isNoteDialogOpen} 
        onClose={() => setIsNoteDialogOpen(false)} 
        onSave={handeSaveNote}
        initialData={selectedNote}
      />

      <DeleteDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={selectedNote?.title}
      />
    </main>
  );
}
