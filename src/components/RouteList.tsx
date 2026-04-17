"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { RouteListProps, OptimizedRoute } from "@/types";

interface SortableItemProps {
  id: string;
  label: string;
}

function SortableItem({ id, label }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <div {...attributes} {...listeners} className="drag-handle">
        <GripVertical size={16} />
      </div>
      <div className="sortable-label">{label}</div>
    </div>
  );
}

export default function RouteList({
  optimizedRoute,
  setOptimizedRoute,
  origin,
  destination,
}: RouteListProps) {
  const [items, setItems] = useState<SortableItemProps[]>([]);

  useEffect(() => {
    if (optimizedRoute && optimizedRoute.optimized_waypoints) {
      setItems(
        optimizedRoute.optimized_waypoints.map((wp: string, idx: number) => ({
          id: `id-${idx}-${wp}`,
          label: wp,
        }))
      );
    }
  }, [optimizedRoute]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        if (setOptimizedRoute) {
          const newRoute: OptimizedRoute = {
            ...optimizedRoute,
            optimized_waypoints: newItems.map((i) => i.label),
          };
          setOptimizedRoute(newRoute);
        }
        return newItems;
      });
    }
  };

  if (!optimizedRoute) return null;

  return (
    <div className="route-list-container">
      <h3 className="route-list-title">訪問順序 (ドラッグで微調整)</h3>

      <div className="route-point start-point">
        <div className="route-badge">出</div>
        <div className="route-point-label">{origin}</div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} label={item.label} />
          ))}
        </SortableContext>
      </DndContext>

      <div className="route-point end-point">
        <div className="route-badge end-badge">着</div>
        <div className="route-point-label">{destination || origin}</div>
      </div>
    </div>
  );
}