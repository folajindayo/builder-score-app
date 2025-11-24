/**
 * Drag and drop utilities
 */

export interface DragDropHandlers {
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
}

export function createDragHandlers(onDrop: (data: string) => void, data: string): DragDropHandlers {
  return {
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', data);
      e.currentTarget.classList.add('opacity-50');
    },
    onDragEnd: (e: React.DragEvent) => {
      e.currentTarget.classList.remove('opacity-50');
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    },
    onDragLeave: (e: React.DragEvent) => {
      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
      const droppedData = e.dataTransfer.getData('text/plain');
      onDrop(droppedData);
    },
  };
}
