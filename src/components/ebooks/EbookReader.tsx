import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FaBookmark, 
  FaSearch, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight,
  FaFont,
  FaHighlighter,
  FaStickyNote,
  FaPalette,
  FaUndo,
  FaRedo,
  FaExpand,
  FaCompress,
  FaBook,
  FaList,
  FaEdit,
  FaTrash,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaBars,
  FaFileExport,
  FaCopy,
  FaEraser,
  FaPen,
  FaMousePointer,
  FaMinus,
  FaPlus,
  FaBookOpen,
  FaClock,
  FaChartLine
} from 'react-icons/fa';
import { Ebook } from '../../types/ebook';

interface EbookReaderProps {
  ebook: Ebook;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onClose: () => void;
}

interface Note {
  id: string;
  type: 'text' | 'highlight' | 'drawing';
  content: string;
  position: { x: number; y: number; page: number };
  color?: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Bookmark {
  id: string;
  page: number;
  title: string;
  note?: string;
  createdAt: string;
}

interface DrawingLayer {
  id: string;
  page: number;
  paths: Array<{ points: Array<{ x: number; y: number }>; color: string; width: number; tool: string }>;
  createdAt: string;
}

type ReadingMode = 'scroll' | 'page' | 'two-page';
type DrawingTool = 'pen' | 'marker' | 'eraser' | 'select';

const EbookReader: React.FC<EbookReaderProps> = ({ ebook, darkMode, fontSize, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(ebook.pages || 100);
  const [zoom, setZoom] = useState(100);
  const [fontSizeReader, setFontSizeReader] = useState(16);
  const [fontFamily, setFontFamily] = useState('serif');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<'bookmarks' | 'notes' | 'settings' | 'toc'>('bookmarks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState<DrawingTool>('pen');
  const [drawingColor, setDrawingColor] = useState('#ff0000');
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [selectedText, setSelectedText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteInputPosition, setNoteInputPosition] = useState({ x: 0, y: 0 });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingMode>('scroll');
  const [showToolbar, setShowToolbar] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [drawingLayers, setDrawingLayers] = useState<DrawingLayer[]>([]);
  const [drawingHistory, setDrawingHistory] = useState<Array<{ action: string; data: any }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([]);
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [noteCategories, setNoteCategories] = useState<string[]>(['Ogólne', 'Ważne', 'Pytania', 'Definicje']);
  const [selectedCategory, setSelectedCategory] = useState<string>('Ogólne');
  
  const readerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());

  // Table of Contents (mock - w rzeczywistości z ebooka)
  const tableOfContents = [
    { id: 1, title: 'Wprowadzenie', page: 1, level: 1 },
    { id: 2, title: 'Rozdział 1: Podstawy', page: 5, level: 1 },
    { id: 3, title: '1.1 Anatomia', page: 5, level: 2 },
    { id: 4, title: '1.2 Fizjologia', page: 15, level: 2 },
    { id: 5, title: 'Rozdział 2: Zaawansowane', page: 30, level: 1 },
    { id: 6, title: '2.1 Patofizjologia', page: 30, level: 2 },
    { id: 7, title: 'Zakończenie', page: 90, level: 1 },
  ];

  // Load saved data
  useEffect(() => {
    const savedNotes = localStorage.getItem(`ebook_notes_${ebook.id}`);
    const savedBookmarks = localStorage.getItem(`ebook_bookmarks_${ebook.id}`);
    const savedPage = localStorage.getItem(`ebook_page_${ebook.id}`);
    const savedSettings = localStorage.getItem(`ebook_settings_${ebook.id}`);
    const savedDrawings = localStorage.getItem(`ebook_drawings_${ebook.id}`);
    const savedProgress = localStorage.getItem(`ebook_progress_${ebook.id}`);
    const savedTime = localStorage.getItem(`ebook_time_${ebook.id}`);
    
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedPage) setCurrentPage(parseInt(savedPage));
    if (savedDrawings) setDrawingLayers(JSON.parse(savedDrawings));
    if (savedProgress) setReadingProgress(parseFloat(savedProgress));
    if (savedTime) setReadingTime(parseInt(savedTime));
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSizeReader(settings.fontSize || 16);
      setFontFamily(settings.fontFamily || 'serif');
      setBackgroundColor(settings.backgroundColor || '#ffffff');
      setTextColor(settings.textColor || '#000000');
      setReadingMode(settings.readingMode || 'scroll');
    }
    
    startTimeRef.current = Date.now();
  }, [ebook.id]);

  // Save data
  useEffect(() => {
    localStorage.setItem(`ebook_notes_${ebook.id}`, JSON.stringify(notes));
  }, [notes, ebook.id]);

  useEffect(() => {
    localStorage.setItem(`ebook_bookmarks_${ebook.id}`, JSON.stringify(bookmarks));
  }, [bookmarks, ebook.id]);

  useEffect(() => {
    localStorage.setItem(`ebook_page_${ebook.id}`, currentPage.toString());
    const progress = (currentPage / totalPages) * 100;
    setReadingProgress(progress);
    localStorage.setItem(`ebook_progress_${ebook.id}`, progress.toString());
  }, [currentPage, totalPages, ebook.id]);

  useEffect(() => {
    localStorage.setItem(`ebook_drawings_${ebook.id}`, JSON.stringify(drawingLayers));
  }, [drawingLayers, ebook.id]);

  useEffect(() => {
    localStorage.setItem(`ebook_settings_${ebook.id}`, JSON.stringify({
      fontSize: fontSizeReader,
      fontFamily,
      backgroundColor,
      textColor,
      readingMode
    }));
  }, [fontSizeReader, fontFamily, backgroundColor, textColor, readingMode, ebook.id]);

  // Track reading time
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setReadingTime(prev => {
        const total = prev + elapsed;
        localStorage.setItem(`ebook_time_${ebook.id}`, total.toString());
        startTimeRef.current = Date.now();
        return total;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [ebook.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            nextPage();
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            prevPage();
          }
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
          }
          break;
        case 'h':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowToolbar(!showToolbar);
          }
          break;
        case 'b':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleBookmark();
          }
          break;
        case 'Escape':
          if (showNoteInput) {
            setShowNoteInput(false);
          } else if (showSidebar) {
            setShowSidebar(false);
          }
          break;
        case 'z':
          if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            e.preventDefault();
            undoDrawing();
          } else if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            e.preventDefault();
            redoDrawing();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, showToolbar, showNoteInput, showSidebar]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setNoteInputPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  };

  const addHighlight = (color?: string) => {
    if (selectedText) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.backgroundColor = color || highlightColor;
        span.style.cursor = 'pointer';
        span.className = 'ebook-highlight';
        try {
          span.appendChild(range.extractContents());
          range.insertNode(span);
          selection.removeAllRanges();
          
          const newNote: Note = {
            id: Date.now().toString(),
            type: 'highlight',
            content: selectedText,
            position: { x: 0, y: 0, page: currentPage },
            color: color || highlightColor,
            category: selectedCategory,
            createdAt: new Date().toISOString()
          };
          setNotes([...notes, newNote]);
          setSelectedText('');
        } catch (e) {
          console.error('Error adding highlight:', e);
        }
      }
    }
  };

  const addTextNote = (text: string) => {
    if (text.trim()) {
      if (editingNote) {
        setNotes(notes.map(n => 
          n.id === editingNote.id 
            ? { ...n, content: text, updatedAt: new Date().toISOString(), category: selectedCategory }
            : n
        ));
        setEditingNote(null);
      } else {
        const newNote: Note = {
          id: Date.now().toString(),
          type: 'text',
          content: text,
          position: noteInputPosition,
          page: currentPage,
          category: selectedCategory,
          createdAt: new Date().toISOString()
        };
        setNotes([...notes, newNote]);
      }
      setShowNoteInput(false);
    }
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setSelectedCategory(note.category || 'Ogólne');
    setNoteInputPosition(note.position);
    setShowNoteInput(true);
  };

  const toggleBookmark = () => {
    const existing = bookmarks.find(b => b.page === currentPage);
    if (existing) {
      setBookmarks(bookmarks.filter(b => b.id !== existing.id));
    } else {
      const title = prompt('Nazwa zakładki (opcjonalnie):') || `Strona ${currentPage}`;
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        page: currentPage,
        title,
        createdAt: new Date().toISOString()
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      readerRef.current?.scrollTo(0, 0);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Mock search results - w rzeczywistości wyszukiwanie w tekście ebooka
      const mockResults = Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => 
        Math.floor(Math.random() * totalPages) + 1
      ).sort((a, b) => a - b);
      setSearchResults(mockResults);
      if (mockResults.length > 0) {
        setCurrentSearchIndex(0);
        goToPage(mockResults[0]);
      }
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  };

  const nextSearchResult = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      goToPage(searchResults[nextIndex]);
    }
  };

  const prevSearchResult = () => {
    if (searchResults.length > 0) {
      const prevIndex = currentSearchIndex <= 0 ? searchResults.length - 1 : currentSearchIndex - 1;
      setCurrentSearchIndex(prevIndex);
      goToPage(searchResults[prevIndex]);
    }
  };

  const handleDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || drawingTool === 'select') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = drawingWidth * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = drawingWidth;
    }

    if (drawingRef.current) {
      ctx.lineTo(x, y);
      ctx.stroke();
      setCurrentPath([...currentPath, { x, y }]);
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
      drawingRef.current = true;
      setCurrentPath([{ x, y }]);
    }
  }, [isDrawing, drawingTool, drawingColor, drawingWidth, currentPath]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || drawingTool === 'select') return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawingRef.current = true;
    setIsDrawing(true);
    setCurrentPath([]);
    handleDrawing(e);
  };

  const stopDrawing = () => {
    if (drawingRef.current && currentPath.length > 0) {
      // Save drawing to history
      const layer = drawingLayers.find(l => l.page === currentPage);
      const newPath = {
        points: currentPath,
        color: drawingColor,
        width: drawingWidth,
        tool: drawingTool
      };
      
      if (layer) {
        const updatedLayer = {
          ...layer,
          paths: [...layer.paths, newPath]
        };
        setDrawingLayers(drawingLayers.map(l => l.id === layer.id ? updatedLayer : l));
      } else {
        const newLayer: DrawingLayer = {
          id: Date.now().toString(),
          page: currentPage,
          paths: [newPath],
          createdAt: new Date().toISOString()
        };
        setDrawingLayers([...drawingLayers, newLayer]);
      }
      
      // Add to history
      setDrawingHistory([...drawingHistory.slice(0, historyIndex + 1), {
        action: 'draw',
        data: { page: currentPage, path: newPath }
      }]);
      setHistoryIndex(drawingHistory.length);
    }
    
    drawingRef.current = false;
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const undoDrawing = () => {
    if (historyIndex >= 0) {
      const action = drawingHistory[historyIndex];
      // Implement undo logic
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redoDrawing = () => {
    if (historyIndex < drawingHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      // Implement redo logic
    }
  };

  const clearDrawing = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    const layer = drawingLayers.find(l => l.page === currentPage);
    if (layer) {
      setDrawingLayers(drawingLayers.filter(l => l.id !== layer.id));
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const exportNotes = () => {
    const notesText = notes.map(n => 
      `[${n.type === 'highlight' ? 'Zaznaczenie' : 'Notatka'}] Strona ${n.page}\n${n.content}\n${n.category ? `Kategoria: ${n.category}` : ''}\n---\n`
    ).join('\n');
    
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ebook.title}_notatki.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySelectedText = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
    }
  };

  const formatReadingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const isBookmarked = bookmarks.some(b => b.page === currentPage);
  const currentPageNotes = notes.filter(n => n.page === currentPage);
  const currentPageDrawings = drawingLayers.find(l => l.page === currentPage);

  // Render drawings on canvas
  useEffect(() => {
    if (canvasRef.current && currentPageDrawings) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      currentPageDrawings.paths.forEach(path => {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        if (path.points.length > 0) {
          ctx.moveTo(path.points[0].x, path.points[0].y);
          path.points.slice(1).forEach(point => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
      });
    }
  }, [currentPageDrawings, currentPage]);

  return (
    <div className={`fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Top Toolbar */}
      {showToolbar && (
        <div className={`${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} px-4 py-3 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Zamknij (Esc)"
            >
              <FaTimes size={20} />
            </button>
            <div>
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {ebook.title}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {ebook.author}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reading Progress */}
            <div className={`text-xs px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {Math.round(readingProgress)}%
            </div>

            {/* Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Wyszukaj (Ctrl+F)"
            >
              <FaSearch size={18} />
            </button>

            {/* Table of Contents */}
            <button
              onClick={() => {
                setSidebarContent('toc');
                setShowSidebar(true);
              }}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Spis treści"
            >
              <FaBars size={18} />
            </button>

            {/* Bookmarks */}
            <button
              onClick={() => {
                setSidebarContent('bookmarks');
                setShowSidebar(true);
              }}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Zakładki (Ctrl+B)"
            >
              <FaList size={18} />
            </button>

            {/* Notes */}
            <button
              onClick={() => {
                setSidebarContent('notes');
                setShowSidebar(true);
              }}
              className={`p-2 rounded-lg transition-colors relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Notatki"
            >
              <FaStickyNote size={18} />
              {currentPageNotes.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {currentPageNotes.length}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                setSidebarContent('settings');
                setShowSidebar(true);
              }}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Ustawienia"
            >
              <FaFont size={18} />
            </button>

            {/* Hide Toolbar */}
            <button
              onClick={() => setShowToolbar(false)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Ukryj pasek (Ctrl+H)"
            >
              <FaEyeSlash size={18} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Pełny ekran (Ctrl+F)"
            >
              {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Show Toolbar Button (when hidden) */}
      {!showToolbar && (
        <button
          onClick={() => setShowToolbar(true)}
          className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          title="Pokaż pasek (Ctrl+H)"
        >
          <FaEye size={20} />
        </button>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className={`${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'} px-4 py-3`}>
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <FaSearch className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Szukaj w tekście..."
              className={`flex-1 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
              autoFocus
            />
            {searchResults.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSearchResult}
                  className="p-1 rounded hover:bg-gray-200"
                  title="Poprzedni wynik"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm text-gray-600">
                  {currentSearchIndex + 1} / {searchResults.length}
                </span>
                <button
                  onClick={nextSearchResult}
                  className="p-1 rounded hover:bg-gray-200"
                  title="Następny wynik"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Reading Progress Bar */}
      <div className={`h-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div
          className="h-full bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        {showSidebar && (
          <div className={`w-80 ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-gray-50 border-r border-gray-200'} overflow-y-auto`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {sidebarContent === 'bookmarks' ? 'Zakładki' : 
                   sidebarContent === 'notes' ? 'Notatki' : 
                   sidebarContent === 'toc' ? 'Spis treści' :
                   'Ustawienia'}
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Table of Contents */}
              {sidebarContent === 'toc' && (
                <div className="space-y-1">
                  {tableOfContents.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        goToPage(item.page);
                        setShowSidebar(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        item.page === currentPage
                          ? 'bg-[#38b6ff] text-white'
                          : darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }`}
                      style={{ paddingLeft: `${(item.level - 1) * 20 + 12}px` }}
                    >
                      <span className="text-sm">{item.title}</span>
                      <span className={`text-xs ml-2 ${item.page === currentPage ? 'opacity-75' : 'opacity-50'}`}>
                        (s. {item.page})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Bookmarks */}
              {sidebarContent === 'bookmarks' && (
                <div className="space-y-2">
                  {bookmarks.length === 0 ? (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Brak zakładek
                    </p>
                  ) : (
                    bookmarks.map(bookmark => (
                      <div
                        key={bookmark.id}
                        className={`p-3 rounded-lg ${
                          bookmark.page === currentPage
                            ? 'bg-[#38b6ff] text-white'
                            : darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <button
                            onClick={() => {
                              goToPage(bookmark.page);
                              setShowSidebar(false);
                            }}
                            className="flex-1 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <FaBookmark className="fill-current" />
                              <span className="font-medium">{bookmark.title}</span>
                            </div>
                            <p className="text-xs mt-1 opacity-75">
                              Strona {bookmark.page}
                            </p>
                          </button>
                          <button
                            onClick={() => setBookmarks(bookmarks.filter(b => b.id !== bookmark.id))}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Notes */}
              {sidebarContent === 'notes' && (
                <div className="space-y-3">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Notatki na stronie {currentPage}:
                      </p>
                      <button
                        onClick={exportNotes}
                        className="text-xs text-[#38b6ff] hover:underline"
                        title="Eksportuj notatki"
                      >
                        <FaFileExport className="inline mr-1" />
                        Eksportuj
                      </button>
                    </div>
                    {currentPageNotes.length === 0 ? (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Brak notatek na tej stronie
                      </p>
                    ) : (
                      currentPageNotes.map(note => (
                        <div
                          key={note.id}
                          className={`p-3 rounded-lg mb-2 border-l-4 ${
                            darkMode ? 'bg-gray-700' : 'bg-white'
                          }`}
                          style={{ borderLeftColor: note.color || '#38b6ff' }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {note.type === 'highlight' ? 'Zaznaczenie' : 'Notatka'}
                              </span>
                              {note.category && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {note.category}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => editNote(note)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edytuj"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => deleteNote(note.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Usuń"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {note.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className={`text-sm mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Wszystkie notatki ({notes.length}):
                    </p>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {notes.map(note => (
                        <div
                          key={note.id}
                          className={`p-2 rounded mb-1 text-xs cursor-pointer border-l-2 ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                          }`}
                          style={{ borderLeftColor: note.color || '#38b6ff' }}
                          onClick={() => {
                            goToPage(note.page);
                            setShowSidebar(false);
                          }}
                        >
                          <p className="truncate font-medium">{note.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Strona {note.page}
                            </p>
                            {note.category && (
                              <span className={`px-1 rounded text-xs ${
                                darkMode ? 'bg-gray-600' : 'bg-gray-200'
                              }`}>
                                {note.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings */}
              {sidebarContent === 'settings' && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Tryb czytania
                    </label>
                    <div className="flex gap-2">
                      {(['scroll', 'page', 'two-page'] as ReadingMode[]).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setReadingMode(mode)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            readingMode === mode
                              ? 'bg-[#38b6ff] text-white'
                              : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {mode === 'scroll' ? 'Scroll' : mode === 'page' ? 'Strona' : 'Dwustronny'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Rozmiar czcionki: {fontSizeReader}px
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFontSizeReader(Math.max(12, fontSizeReader - 1))}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <FaMinus size={12} />
                      </button>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={fontSizeReader}
                        onChange={(e) => setFontSizeReader(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <button
                        onClick={() => setFontSizeReader(Math.min(24, fontSizeReader + 1))}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Czcionka
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                    >
                      <option value="serif">Serif</option>
                      <option value="sans-serif">Sans-serif</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Kolor tła
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {['#ffffff', '#f4f4f4', '#ffeaa7', '#dfe6e9', '#1a1a1a'].map(color => (
                        <button
                          key={color}
                          onClick={() => setBackgroundColor(color)}
                          className={`w-10 h-10 rounded border-2 ${
                            backgroundColor === color ? 'border-[#38b6ff]' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color === '#1a1a1a' ? 'Tryb nocny' : ''}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Kolor tekstu
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {['#000000', '#333333', '#666666', '#8b4513', '#ffffff'].map(color => (
                        <button
                          key={color}
                          onClick={() => setTextColor(color)}
                          className={`w-10 h-10 rounded border-2 ${
                            textColor === color ? 'border-[#38b6ff]' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Statystyki czytania
                    </p>
                    <div className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex justify-between">
                        <span>Postęp:</span>
                        <span className="font-semibold">{Math.round(readingProgress)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Czas czytania:</span>
                        <span className="font-semibold">{formatReadingTime(readingTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Przeczytane strony:</span>
                        <span className="font-semibold">{currentPage} / {totalPages}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Reader */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={readerRef}
            className={`h-full ${readingMode === 'scroll' ? 'overflow-y-auto' : 'overflow-hidden'} px-8 py-6`}
            style={{
              backgroundColor,
              color: textColor,
              fontSize: `${fontSizeReader}px`,
              fontFamily
            }}
            onMouseUp={handleTextSelection}
          >
            {/* Mock Content - w rzeczywistości tutaj byłby renderowany ebook */}
            <div className={`max-w-4xl mx-auto ${readingMode === 'two-page' ? 'grid grid-cols-2 gap-4' : ''}`}>
              {readingMode === 'page' ? (
                // Single page mode
                <div
                  className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}
                  style={{ minHeight: '800px' }}
                >
                  <div className="mb-4 text-sm text-gray-500">
                    Strona {currentPage} z {totalPages}
                  </div>
                  <div className="prose max-w-none">
                    <h1 className="text-3xl font-bold mb-4">{ebook.title}</h1>
                    <p className="text-lg mb-6 text-gray-600">{ebook.author}</p>
                    <p className="mb-4">
                      To jest przykładowa treść ebooka na stronie {currentPage}. W rzeczywistej implementacji
                      tutaj byłby renderowany rzeczywisty tekst ebooka z pliku PDF lub EPUB.
                    </p>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
                      ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              ) : readingMode === 'two-page' ? (
                // Two page mode
                <>
                  <div className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
                    <div className="prose max-w-none">
                      <p>Strona {currentPage}</p>
                      <p>Lewa strona...</p>
                    </div>
                  </div>
                  <div className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
                    <div className="prose max-w-none">
                      <p>Strona {currentPage + 1}</p>
                      <p>Prawa strona...</p>
                    </div>
                  </div>
                </>
              ) : (
                // Scroll mode
                <>
                  <h1 className="text-3xl font-bold mb-4">{ebook.title}</h1>
                  <p className="text-lg mb-6 text-gray-600">{ebook.author}</p>
                  
                  {Array.from({ length: Math.min(5, totalPages - currentPage + 1) }).map((_, idx) => {
                    const pageNum = currentPage + idx;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <div
                        key={pageNum}
                        className={`mb-8 p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}
                        style={{ minHeight: '800px' }}
                      >
                        <div className="mb-4 text-sm text-gray-500">
                          Strona {pageNum} z {totalPages}
                        </div>
                        <div className="prose max-w-none">
                          <p className="mb-4">
                            To jest przykładowa treść ebooka na stronie {pageNum}. W rzeczywistej implementacji
                            tutaj byłby renderowany rzeczywisty tekst ebooka z pliku PDF lub EPUB. Możesz
                            zaznaczać tekst, dodawać notatki, rysować i tworzyć zakładki.
                          </p>
                          <p className="mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                          </p>
                          <p className="mb-4">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                            qui officia deserunt mollit anim id est laborum.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Drawing Canvas */}
          {isDrawing && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-auto cursor-crosshair"
              width={window.innerWidth}
              height={window.innerHeight}
              onMouseDown={startDrawing}
              onMouseMove={handleDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          )}

          {/* Note Input */}
          {showNoteInput && (
            <div
              className="absolute bg-white border-2 border-[#38b6ff] rounded-lg shadow-xl p-4 z-50"
              style={{
                left: `${Math.min(noteInputPosition.x, window.innerWidth - 300)}px`,
                top: `${Math.min(noteInputPosition.y + 30, window.innerHeight - 200)}px`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="mb-2">
                <label className="block text-xs font-medium mb-1 text-gray-700">Kategoria:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  {noteCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <textarea
                autoFocus
                placeholder={editingNote ? "Edytuj notatkę..." : "Dodaj notatkę..."}
                defaultValue={editingNote?.content || ''}
                className="w-64 h-24 p-2 border border-gray-300 rounded resize-none text-sm"
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    addTextNote(e.target.value);
                  } else {
                    setShowNoteInput(false);
                    setEditingNote(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    addTextNote(e.currentTarget.value);
                  } else if (e.key === 'Escape') {
                    setShowNoteInput(false);
                    setEditingNote(null);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Toolbar */}
      {showToolbar && (
        <div className={`${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
              title="Poprzednia strona (Ctrl+←)"
            >
              <FaChevronLeft />
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className={`w-16 px-2 py-1 rounded text-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                / {totalPages}
              </span>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
              title="Następna strona (Ctrl+→)"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Text */}
            {selectedText && (
              <button
                onClick={copySelectedText}
                className="p-2 rounded-lg hover:bg-gray-200"
                title="Kopiuj tekst"
              >
                <FaCopy size={14} />
              </button>
            )}

            {/* Highlight Colors */}
            {selectedText && (
              <div className="flex items-center gap-1">
                {['#ffff00', '#ffcccc', '#ccffcc', '#ccccff'].map(color => (
                  <button
                    key={color}
                    onClick={() => addHighlight(color)}
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                    title="Zaznacz tym kolorem"
                  />
                ))}
              </div>
            )}

            {/* Add Note */}
            <button
              onClick={() => {
                setEditingNote(null);
                setNoteInputPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
                setShowNoteInput(true);
              }}
              className="p-2 rounded-lg hover:bg-gray-200"
              title="Dodaj notatkę"
            >
              <FaStickyNote />
            </button>

            {/* Drawing Tools */}
            <div className="flex items-center gap-1 border-l pl-2">
              <button
                onClick={() => {
                  setDrawingTool('select');
                  setIsDrawing(false);
                }}
                className={`p-2 rounded-lg ${drawingTool === 'select' ? 'bg-[#38b6ff] text-white' : 'hover:bg-gray-200'}`}
                title="Zaznaczanie"
              >
                <FaMousePointer size={14} />
              </button>
              <button
                onClick={() => {
                  setDrawingTool('pen');
                  setIsDrawing(true);
                }}
                className={`p-2 rounded-lg ${drawingTool === 'pen' && isDrawing ? 'bg-[#38b6ff] text-white' : 'hover:bg-gray-200'}`}
                title="Pióro"
              >
                <FaPen size={14} />
              </button>
              <button
                onClick={() => {
                  setDrawingTool('marker');
                  setIsDrawing(true);
                }}
                className={`p-2 rounded-lg ${drawingTool === 'marker' && isDrawing ? 'bg-[#38b6ff] text-white' : 'hover:bg-gray-200'}`}
                title="Marker"
              >
                <FaHighlighter size={14} />
              </button>
              {isDrawing && (
                <>
                  <input
                    type="color"
                    value={drawingColor}
                    onChange={(e) => setDrawingColor(e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    title="Kolor"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDrawingWidth(Math.max(1, drawingWidth - 1))}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="text-xs w-8 text-center">{drawingWidth}px</span>
                    <button
                      onClick={() => setDrawingWidth(Math.min(10, drawingWidth + 1))}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                  <button
                    onClick={() => setDrawingTool('eraser')}
                    className={`p-2 rounded-lg ${drawingTool === 'eraser' ? 'bg-[#38b6ff] text-white' : 'hover:bg-gray-200'}`}
                    title="Gumka"
                  >
                    <FaEraser size={14} />
                  </button>
                  <button
                    onClick={clearDrawing}
                    className="p-2 rounded-lg hover:bg-gray-200 text-red-500"
                    title="Wyczyść rysunki"
                  >
                    <FaTrash size={14} />
                  </button>
                  {(historyIndex >= 0 || historyIndex < drawingHistory.length - 1) && (
                    <>
                      <button
                        onClick={undoDrawing}
                        disabled={historyIndex < 0}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        title="Cofnij (Ctrl+Z)"
                      >
                        <FaUndo size={14} />
                      </button>
                      <button
                        onClick={redoDrawing}
                        disabled={historyIndex >= drawingHistory.length - 1}
                        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        title="Ponów (Ctrl+Shift+Z)"
                      >
                        <FaRedo size={14} />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Bookmark */}
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-lg ${isBookmarked ? 'text-[#38b6ff]' : 'hover:bg-gray-200'}`}
              title="Dodaj zakładkę (Ctrl+B)"
            >
              <FaBookmark className={isBookmarked ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookReader;
