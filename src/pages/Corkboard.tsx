import {
  GripHorizontal,
  Lock,
  Plus,
  RotateCcw,
  StickyNote,
  Trash2,
  Unlock,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import backgroundImage from "../assets/background2.png";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { cn } from "../utils/utils";

type NoteColor = {
  name: string;
  value: string;
  accent: string;
};

type CorkNote = {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  pinned: boolean;
  updatedAt: number;
};

type DragState = {
  noteId: string;
  offsetX: number;
  offsetY: number;
  noteWidth: number;
  noteHeight: number;
};

const STORAGE_KEY = "egghub:corkboard-notes";

const noteColors: NoteColor[] = [
  { name: "Lemon", value: "#fff2a8", accent: "border-yellow-300" },
  { name: "Mint", value: "#c9f7dc", accent: "border-emerald-300" },
  { name: "Rose", value: "#ffd1dc", accent: "border-rose-300" },
  { name: "Sky", value: "#cfe8ff", accent: "border-sky-300" },
  { name: "Lilac", value: "#e4d7ff", accent: "border-violet-300" },
];

const noteAngles = [-2.5, 1.5, -1, 2.25, -1.75, 1];

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const createNote = (index = 0): CorkNote => ({
  id: crypto.randomUUID(),
  text: "",
  color: noteColors[index % noteColors.length].value,
  x: clamp(8 + index * 8, 4, 68),
  y: clamp(8 + index * 6, 4, 58),
  rotation: noteAngles[index % noteAngles.length],
  pinned: false,
  updatedAt: Date.now(),
});

const defaultNotes: CorkNote[] = [
  {
    ...createNote(0),
    id: "welcome-note",
    text: "Write a quick reminder, idea, or task here.",
    pinned: true,
  },
  {
    ...createNote(1),
    id: "drag-note",
    text: "Drag the top strip to move notes around the corkboard.",
    x: 38,
    y: 18,
  },
];

const isCorkNote = (note: Partial<CorkNote>): note is CorkNote => {
  return (
    typeof note.id === "string" &&
    typeof note.text === "string" &&
    typeof note.color === "string" &&
    typeof note.x === "number" &&
    typeof note.y === "number" &&
    typeof note.rotation === "number" &&
    typeof note.pinned === "boolean" &&
    typeof note.updatedAt === "number"
  );
};

const loadNotes = () => {
  const savedNotes = window.localStorage.getItem(STORAGE_KEY);

  if (!savedNotes) {
    return defaultNotes;
  }

  try {
    const parsedNotes = JSON.parse(savedNotes) as Partial<CorkNote>[];
    const validNotes = parsedNotes.filter(isCorkNote);
    return validNotes.length > 0 ? validNotes : defaultNotes;
  } catch {
    return defaultNotes;
  }
};

const Corkboard = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<CorkNote[]>(loadNotes);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const pinnedCount = useMemo(
    () => notes.filter((note) => note.pinned).length,
    [notes],
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const moveNote = (event: PointerEvent) => {
      const board = boardRef.current;

      if (!board) {
        return;
      }

      const boardRect = board.getBoundingClientRect();
      const maxX = Math.max(boardRect.width - dragState.noteWidth, 0);
      const maxY = Math.max(boardRect.height - dragState.noteHeight, 0);
      const nextX = clamp(
        event.clientX - boardRect.left - dragState.offsetX,
        0,
        maxX,
      );
      const nextY = clamp(
        event.clientY - boardRect.top - dragState.offsetY,
        0,
        maxY,
      );

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === dragState.noteId
            ? {
                ...note,
                x: (nextX / boardRect.width) * 100,
                y: (nextY / boardRect.height) * 100,
                updatedAt: Date.now(),
              }
            : note,
        ),
      );
    };

    const stopDrag = () => setDragState(null);

    window.addEventListener("pointermove", moveNote);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);

    return () => {
      window.removeEventListener("pointermove", moveNote);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, [dragState]);

  const addNote = () => {
    setNotes((currentNotes) => [...currentNotes, createNote(currentNotes.length)]);
  };

  const updateNote = (noteId: string, updates: Partial<CorkNote>) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              ...updates,
              updatedAt: Date.now(),
            }
          : note,
      ),
    );
  };

  const deleteNote = (noteId: string) => {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId),
    );
  };

  const resetBoard = () => {
    setNotes(defaultNotes.map((note) => ({ ...note, id: crypto.randomUUID() })));
  };

  const startDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
    note: CorkNote,
  ) => {
    if (note.pinned) {
      return;
    }

    const noteElement = event.currentTarget.closest("article");

    if (!noteElement) {
      return;
    }

    const noteRect = noteElement.getBoundingClientRect();
    setDragState({
      noteId: note.id,
      offsetX: event.clientX - noteRect.left,
      offsetY: event.clientY - noteRect.top,
      noteWidth: noteRect.width,
      noteHeight: noteRect.height,
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-white/80 bg-white/92 p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Note Taking
            </p>
            <h1 className="text-2xl font-bold text-gray-950 sm:text-3xl">
              Corkboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {notes.length} notes, {pinnedCount} pinned
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetBoard}
              className="border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
            >
              <RotateCcw />
              Reset
            </Button>
            <Button
              type="button"
              onClick={addNote}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              <Plus />
              Add Note
            </Button>
          </div>
        </div>

        <section
          ref={boardRef}
          className="relative min-h-[680px] overflow-hidden rounded-lg border-[10px] border-[#8f5a32] shadow-2xl"
          style={{
            backgroundColor: "#b97745",
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.16) 0 1px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(64,30,13,0.18) 0 1px, transparent 1px), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(72,32,14,0.14))",
            backgroundSize: "18px 18px, 22px 22px, 100% 100%",
          }}
        >
          {notes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg">
                <StickyNote className="mx-auto mb-3 text-orange-600" size={34} />
                <h2 className="text-xl font-bold text-gray-950">
                  Your board is clear
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Add a note and start pinning thoughts.
                </p>
              </div>
            </div>
          )}

          {notes.map((note) => (
            <article
              key={note.id}
              className="absolute flex h-56 w-[min(18rem,calc(100vw-4rem))] flex-col rounded-sm border border-black/10 p-3 shadow-xl transition-shadow focus-within:shadow-2xl"
              style={{
                left: `${note.x}%`,
                top: `${note.y}%`,
                backgroundColor: note.color,
                transform: `rotate(${note.rotation}deg)`,
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onPointerDown={(event) => startDrag(event, note)}
                  className={cn(
                    "flex h-8 min-w-0 flex-1 items-center justify-center rounded-sm border border-black/10 bg-white/35 text-gray-700 outline-none transition hover:bg-white/55 focus-visible:ring-2 focus-visible:ring-orange-500",
                    note.pinned ? "cursor-not-allowed opacity-70" : "cursor-grab",
                  )}
                  title={note.pinned ? "Unpin to move" : "Drag note"}
                  aria-label={note.pinned ? "Note is pinned" : "Drag note"}
                >
                  <GripHorizontal size={18} />
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => updateNote(note.id, { pinned: !note.pinned })}
                  title={note.pinned ? "Unpin note" : "Pin note"}
                  className="size-8 bg-white/25 text-gray-700 hover:bg-white/55"
                >
                  {note.pinned ? <Lock /> : <Unlock />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNote(note.id)}
                  title="Delete note"
                  className="size-8 bg-white/25 text-gray-700 hover:bg-white/55 hover:text-red-700"
                >
                  <Trash2 />
                </Button>
              </div>

              <textarea
                value={note.text}
                onChange={(event) =>
                  updateNote(note.id, { text: event.target.value })
                }
                className="min-h-0 flex-1 resize-none bg-transparent text-base leading-6 text-gray-950 outline-none placeholder:text-gray-600/70"
                placeholder="Type a note..."
              />

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex gap-1">
                  {noteColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => updateNote(note.id, { color: color.value })}
                      className={cn(
                        "size-6 rounded-full border-2 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                        note.color === color.value
                          ? "border-gray-950"
                          : color.accent,
                      )}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Use ${color.name} note color`}
                      title={color.name}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-700/80">
                  {note.pinned ? "Pinned" : "Moveable"}
                </span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Corkboard;
