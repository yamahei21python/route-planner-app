"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

function SortableItem(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex bg-white rounded-lg border border-gray-200 shadow-[var(--shadow-uber-light)] p-3 mb-2 items-center z-20">
      <div {...attributes} {...listeners} className="cursor-grab p-1 mr-2 text-[var(--color-muted-gray)] hover:text-black">
        <GripVertical size={16} />
      </div>
      <div className="flex-1 font-medium text-[var(--color-uber-black)] text-sm">{props.label}</div>
    </div>
  );
}

export default function RouteList({ optimizedRoute, setOptimizedRoute, origin, destination }: any) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (optimizedRoute && optimizedRoute.optimized_waypoints) {
      setItems(optimizedRoute.optimized_waypoints.map((wp: string, idx: number) => ({
        id: `id-${idx}-${wp}`,
        label: wp
      })));
    }
  }, [optimizedRoute]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // update parent optimizedRoute state to re-trigger map
        if (setOptimizedRoute) {
          const newRoute = { ...optimizedRoute };
          newRoute.optimized_waypoints = newItems.map(i => i.label);
          setOptimizedRoute(newRoute);
        }
        return newItems;
      });
    }
  };

  if (!optimizedRoute) return null;

  return (
    <div className="mt-4 border-t border-gray-100 pt-4 pb-8">
      <h3 className="text-sm font-bold mb-3 text-[var(--color-uber-black)]">訪問順序 (ドラッグで微調整)</h3>
      
      {/* Starting point */}
      <div className="flex bg-[var(--color-chip-gray)] rounded-lg px-3 py-2.5 mb-2 items-center">
        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold mr-3">出</div>
        <div className="font-medium text-sm">{origin}</div>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} label={item.label} />
          ))}
        </SortableContext>
      </DndContext>
      
      {/* End point */}
      <div className="flex bg-[var(--color-chip-gray)] rounded-lg px-3 py-2.5 mt-2 items-center">
        <div className="w-5 h-5 rounded-full border-2 border-black bg-white text-black flex items-center justify-center text-[10px] font-bold mr-3">着</div>
        <div className="font-medium text-sm">{destination || origin}</div>
      </div>
    </div>
  );
}
