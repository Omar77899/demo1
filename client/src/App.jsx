import { useEffect, useReducer, useState } from 'react';
import BookForm from './components/BookForm.jsx';
import BookList from './components/BookList.jsx';
import * as api from './api.js';

const initialState = { books: [], loading: true };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_BOOKS':
      return { books: action.payload, loading: false };
    case 'ADD_BOOK':
      return { ...state, books: [action.payload, ...state.books] };
    case 'MARK_READ':
      return {
        ...state,
        books: state.books.map((b) => (b.id === action.payload.id ? action.payload : b)),
      };
    case 'DELETE_BOOK':
      return { ...state, books: state.books.filter((b) => b.id !== action.payload) };
    case 'LOAD_FAILED':
      return { ...state, loading: false };
    default:
      return state;
  }
}

export default function App() {
  const [{ books, loading }, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getBooks()
      .then((data) => dispatch({ type: 'SET_BOOKS', payload: data }))
      .catch((err) => {
        setError(err.message);
        dispatch({ type: 'LOAD_FAILED' });
      });
  }, []);

  const handleAdd = async (title, author) => {
    setError('');
    try {
      const book = await api.addBook(title, author);
      dispatch({ type: 'ADD_BOOK', payload: book });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleMarkRead = async (id) => {
    setError('');
    try {
      const book = await api.markAsRead(id);
      dispatch({ type: 'MARK_READ', payload: book });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await api.deleteBook(id);
      dispatch({ type: 'DELETE_BOOK', payload: id });
    } catch (err) {
      setError(err.message);
    }
  };

  const readCount = books.filter((b) => b.status === 'read').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-indigo-600 text-white">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
          <h1 className="text-2xl font-bold sm:text-3xl">BookShelf Manager</h1>
          <p className="mt-1 text-sm text-indigo-100 sm:text-base">
            Keep track of your personal reading list.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-8">
        <BookForm onAdd={handleAdd} />

        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="font-semibold hover:text-red-900"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">My Books</h2>
            <span className="text-sm text-slate-500">
              {readCount} of {books.length} read
            </span>
          </div>
          <BookList
            books={books}
            loading={loading}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}


// import { useEffect, useReducer, useState } from 'react';
// import BookForm from './components/BookForm.jsx';
// import BookList from './components/BookList.jsx';
// import * as api from './api.js';

// const initialState = { books: [], loading: true };

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SET_BOOKS':
//       return { books: action.payload, loading: false };
//     case 'ADD_BOOK':
//       return { ...state, books: [action.payload, ...state.books] };
//     case 'MARK_READ':
//       return {
//         ...state,
//         books: state.books.map((b) => (b.id === action.payload.id ? action.payload : b)),
//       };
//     case 'DELETE_BOOK':
//       return { ...state, books: state.books.filter((b) => b.id !== action.payload) };
//     case 'LOAD_FAILED':
//       return { ...state, loading: false };
//     default:
//       return state;
//   }
// }

// export default function App() {
//   const [{ books, loading }, dispatch] = useReducer(reducer, initialState);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     api
//       .getBooks()
//       .then((data) => dispatch({ type: 'SET_BOOKS', payload: data }))
//       .catch((err) => {
//         setError(err.message);
//         dispatch({ type: 'LOAD_FAILED' });
//       });
//   }, []);

//   const handleAdd = async (title, author) => {
//     setError('');
//     try {
//       const book = await api.addBook(title, author);
//       dispatch({ type: 'ADD_BOOK', payload: book });
//       return true;
//     } catch (err) {
//       setError(err.message);
//       return false;
//     }
//   };

//   const handleMarkRead = async (id) => {
//     setError('');
//     try {
//       const book = await api.markAsRead(id);
//       dispatch({ type: 'MARK_READ', payload: book });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     setError('');
//     try {
//       await api.deleteBook(id);
//       dispatch({ type: 'DELETE_BOOK', payload: id });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const readCount = books.filter((b) => b.status === 'read').length;
//   const unreadCount = books.length - readCount;
//   const percent = books.length ? Math.round((readCount / books.length) * 100) : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 text-rose-950 antialiased">
//       {/* soft decorative blobs */}
//       <div className="pointer-events-none fixed -left-24 -top-24 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl" />
//       <div className="pointer-events-none fixed -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-300/30 blur-3xl" />

//       <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[340px_1fr] lg:py-14">
//         {/* ---------- Left panel ---------- */}
//         <aside className="space-y-6 lg:sticky lg:top-10 lg:self-start">
//           <div className="text-center lg:text-left">
//             <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
//               My Little Library
//             </p>
//             <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-rose-900">
//               BookShelf
//               <span className="block italic text-pink-500">Manager</span>
//             </h1>
//             <p className="mt-3 text-sm text-rose-700/70">
//               Tomar favourite boi gulo, ek jaygay shundor kore shajano
//             </p>
//           </div>

//           {/* stats */}
//           <div className="rounded-3xl border border-pink-200 bg-white/70 p-5 shadow-lg shadow-pink-200/50 backdrop-blur">
//             <div className="flex items-end justify-between">
//               <div>
//                 <p className="font-serif text-5xl font-bold text-pink-500">{percent}%</p>
//                 <p className="mt-1 text-xs uppercase tracking-widest text-rose-400">completed</p>
//               </div>
//               <p className="text-right text-sm text-rose-700/70">
//                 {readCount} of {books.length} read
//               </p>
//             </div>

//             <div className="mt-4 h-3 overflow-hidden rounded-full bg-pink-100">
//               <div
//                 className="h-full rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500 transition-all duration-500"
//                 style={{ width: `${percent}%` }}
//               />
//             </div>

//             <div className="mt-5 grid grid-cols-3 gap-2 text-center">
//               <div className="rounded-2xl bg-pink-50 py-3">
//                 <p className="text-xl font-semibold text-rose-900">{books.length}</p>
//                 <p className="text-[10px] uppercase tracking-widest text-rose-400">Total</p>
//               </div>
//               <div className="rounded-2xl bg-pink-50 py-3">
//                 <p className="text-xl font-semibold text-pink-600">{readCount}</p>
//                 <p className="text-[10px] uppercase tracking-widest text-rose-400">Read</p>
//               </div>
//               <div className="rounded-2xl bg-pink-50 py-3">
//                 <p className="text-xl font-semibold text-fuchsia-600">{unreadCount}</p>
//                 <p className="text-[10px] uppercase tracking-widest text-rose-400">To read</p>
//               </div>
//             </div>
//           </div>

//           {/* form */}
//           <div className="rounded-3xl border border-pink-200 bg-white p-5 shadow-lg shadow-pink-200/50">
//             <h2 className="mb-3 font-serif text-lg font-semibold text-rose-900">
//               Add a new book 📖
//             </h2>
//             <BookForm onAdd={handleAdd} />
//           </div>
//         </aside>

//         {/* ---------- Right panel ---------- */}
//         <main className="space-y-5">
//           {error && (
//             <div
//               role="alert"
//               className="flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
//             >
//               <span>{error}</span>
//               <button
//                 onClick={() => setError('')}
//                 className="font-semibold hover:text-red-800"
//                 aria-label="Dismiss error"
//               >
//                 ✕
//               </button>
//             </div>
//           )}

//           <div className="flex items-center gap-4">
//             <h2 className="font-serif text-2xl font-semibold text-rose-900">My Books</h2>
//             <div className="h-px flex-1 bg-pink-300/60" />
//             <span className="rounded-full border border-pink-300 bg-white/70 px-3 py-1 text-xs text-pink-600">
//               {readCount} / {books.length}
//             </span>
//           </div>

//           <div className="rounded-3xl border border-pink-200 bg-white/80 p-4 shadow-lg shadow-pink-200/50 backdrop-blur sm:p-6">
//             <BookList
//               books={books}
//               loading={loading}
//               onMarkRead={handleMarkRead}
//               onDelete={handleDelete}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
