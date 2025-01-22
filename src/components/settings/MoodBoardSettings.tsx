'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface MoodBoardItem {
  id: string;
  url: string;
  caption?: string;
}

interface MoodBoardSettingsProps {
  initialData?: MoodBoardItem[];
  onSave: (data: { moodBoard: MoodBoardItem[] }) => void;
}

function SortableItem({ item }: { item: MoodBoardItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group touch-none"
    >
      <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
        <Image
          src={item.url}
          alt="Mood board item"
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            document.dispatchEvent(new CustomEvent('remove-item', { detail: item.id }));
          }}
        >
          <XMarkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function MoodBoardSettings({ initialData = [], onSave }: MoodBoardSettingsProps) {
  const [items, setItems] = useState<MoodBoardItem[]>(initialData);
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', files[0]);

      // Upload to your storage service
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await response.json();

      // Add new item to the list
      const newItem: MoodBoardItem = {
        id: Date.now().toString(),
        url,
      };

      setItems((prev) => [...prev, newItem]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        return newItems;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ moodBoard: items });
  };

  // Setup event listener for remove item
  useState(() => {
    const handleRemoveEvent = (e: CustomEvent) => handleRemoveItem(e.detail);
    document.addEventListener('remove-item', handleRemoveEvent as EventListener);
    return () => {
      document.removeEventListener('remove-item', handleRemoveEvent as EventListener);
    };
  });

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Mood Board Settings</CardTitle>
          <CardDescription>
            Customize your mood board to express your personality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="relative"
              disabled={uploading}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Image
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {items.map((item) => (
                    <SortableItem key={item.id} item={item} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>
        </CardContent>
      </Card>
    </form>
  );
}
