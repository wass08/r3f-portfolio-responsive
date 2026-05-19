import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Calendar App - System Calendar Application
 */
const CalendarApp = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [creatingDate, setCreatingDate] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [activeEventId, setActiveEventId] = useState(null);
  const [formState, setFormState] = useState({ title: '', description: '', location: '' });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const editingEvent = useMemo(
    () => events.find((event) => event.id === editingEventId) || null,
    [events, editingEventId]
  );

  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) || null,
    [events, activeEventId]
  );

  useGSAP(
    () => {
      if (!creatingDate && !editingEventId) return;
      gsap.fromTo(
        '.calendar-form-shell',
        { opacity: 0, y: 18, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.calendar-form-field',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.24, stagger: 0.05, ease: 'power2.out', delay: 0.08 }
      );
    },
    { dependencies: [creatingDate, editingEventId] }
  );

  const handleCreateEvent = (dateStr) => {
    const ev = {
      id: `ev-${Date.now()}`,
      title: formState.title.trim() || 'New Event',
      date: dateStr,
      description: formState.description.trim(),
      location: formState.location.trim(),
      createdAt: Date.now(),
    };
    setEvents((es) => [...es, ev]);
    setCreatingDate(null);
    setFormState({ title: '', description: '', location: '' });
    setActiveEventId(ev.id);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;
    const nextTitle = formState.title.trim() || 'Untitled Event';

    setEvents((existing) =>
      existing.map((event) =>
        event.id === editingEvent.id
          ? {
              ...event,
              title: nextTitle,
              description: formState.description.trim(),
              location: formState.location.trim(),
              updatedAt: Date.now(),
            }
          : event
      )
    );

    setEditingEventId(null);
    setFormState({ title: '', description: '', location: '' });
    setActiveEventId(editingEvent.id);
  };

  const startCreateForDate = (dateStr) => {
    setEditingEventId(null);
    setCreatingDate(dateStr);
    setFormState({ title: '', description: '', location: '' });
  };

  const startEditEvent = (event) => {
    setCreatingDate(null);
    setEditingEventId(event.id);
    setFormState({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
    });
  };

  const deleteEvent = (eventId) => {
    setEvents((existing) => existing.filter((event) => event.id !== eventId));
    if (activeEventId === eventId) {
      setActiveEventId(null);
    }
    if (editingEventId === eventId) {
      setEditingEventId(null);
      setFormState({ title: '', description: '', location: '' });
    }
  };

  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h1>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-neutral-600 dark:text-neutral-400 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString();
              const dayEvents = events.filter((e) => e.date === dateStr);
              return (
              <div
                key={day}
                className="aspect-square flex flex-col items-start justify-start rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm cursor-pointer p-2"
                onClick={() => startCreateForDate(dateStr)}
              >
                <div className="text-xs font-medium">{day}</div>
                <div className="mt-1 space-y-1 w-full">
                  {dayEvents.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveEventId(ev.id);
                      }}
                      className="w-full text-left text-[11px] bg-white/5 rounded px-1 truncate hover:bg-cyan-500/20"
                    >
                      {ev.title}
                    </button>
                  ))}
                </div>
              </div>
            )})}
        </div>
      </div>

      {/* Full Event View */}
      {activeEvent && (
        <div className="absolute inset-0 z-20 bg-neutral-950/90 backdrop-blur-lg p-6 overflow-auto">
          <div className="max-w-3xl mx-auto bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="text-xs uppercase tracking-wide text-cyan-300/80">Event Details</div>
                <h2 className="text-2xl font-bold text-white mt-1">{activeEvent.title}</h2>
                <div className="text-sm text-neutral-400 mt-2">
                  {new Date(activeEvent.date).toLocaleDateString()} at {activeEvent.location || 'No location set'}
                </div>
              </div>
              <button
                onClick={() => setActiveEventId(null)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-neutral-200 hover:bg-white/20"
              >
                Close
              </button>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-neutral-200 whitespace-pre-wrap min-h-[140px]">
              {activeEvent.description || 'No description yet.'}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => startEditEvent(activeEvent)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400"
              >
                Edit
              </button>
              <button
                onClick={() => deleteEvent(activeEvent.id)}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {(creatingDate || editingEvent) && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="calendar-form-shell bg-white dark:bg-neutral-800 rounded-xl p-5 w-full max-w-md border border-white/10">
            <h3 className="calendar-form-field font-semibold mb-1 text-neutral-900 dark:text-white">
              {editingEvent ? 'Edit Event' : `Create event for ${new Date(creatingDate).toLocaleDateString()}`}
            </h3>
            <p className="calendar-form-field text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              {editingEvent ? 'Update details and save changes.' : 'Set title, location, and notes for this date.'}
            </p>

            <input
              value={formState.title}
              onChange={(event) => setFormState((state) => ({ ...state, title: event.target.value }))}
              className="calendar-form-field w-full p-2.5 rounded-lg mb-2 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10"
              placeholder="Event title"
            />
            <input
              value={formState.location}
              onChange={(event) => setFormState((state) => ({ ...state, location: event.target.value }))}
              className="calendar-form-field w-full p-2.5 rounded-lg mb-2 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10"
              placeholder="Location (optional)"
            />
            <textarea
              value={formState.description}
              onChange={(event) => setFormState((state) => ({ ...state, description: event.target.value }))}
              className="calendar-form-field w-full p-2.5 rounded-lg mb-3 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 min-h-[100px]"
              placeholder="Description"
            />
            <div className="calendar-form-field flex justify-end gap-2">
              <button
                onClick={() => {
                  setCreatingDate(null);
                  setEditingEventId(null);
                  setFormState({ title: '', description: '', location: '' });
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingEvent) {
                    handleUpdateEvent();
                    return;
                  }
                  handleCreateEvent(creatingDate);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white"
              >
                {editingEvent ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
