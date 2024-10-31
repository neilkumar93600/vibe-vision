import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, X, Play, Shuffle } from 'lucide-react';

const QueueManager = ({ currentTrack, queue, onQueueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(queue);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onQueueChange(items);
  };

  const removeFromQueue = (index) => {
    const newQueue = queue.filter((_, i) => i !== index);
    onQueueChange(newQueue);
  };

  const shuffleQueue = () => {
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
    onQueueChange(shuffled);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Queue</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={shuffleQueue}>
            <Shuffle size={16} />
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
            {queue.length} tracks
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {currentTrack && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Now Playing</h3>
            <div className="flex items-center gap-3 p-2 bg-primary/10 rounded-lg mt-1">
              <img
                src={currentTrack.coverArt}
                alt={currentTrack.title}
                className="w-10 h-10 rounded"
              />
              <div>
                <p className="font-medium">{currentTrack.title}</p>
                <p className="text-sm text-gray-500">{currentTrack.artist}</p>
              </div>
            </div>
          </div>
        )}

        <h3 className="text-sm font-medium text-gray-500 mb-2">Next Up</h3>
        <ScrollArea className="h-[400px]">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="queue">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-1"
                >
                  {queue.map((track, index) => (
                    <Draggable
                      key={track.id}
                      draggableId={track.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100/5 rounded-lg group"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-500 hover:text-gray-400"
                          >
                            <GripVertical size={16} />
                          </div>
                          
                          <img
                            src={track.coverArt}
                            alt={track.title}
                            className="w-10 h-10 rounded"
                          />
                          
                          <div className="flex-1">
                            <p className="font-medium">{track.title}</p>
                            <p className="text-sm text-gray-500">{track.artist}</p>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {/* Play this track */}}
                            >
                              <Play size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => removeFromQueue(index)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QueueManager;
