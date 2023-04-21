
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Chat from "./pages/ChatPage"
function App() {
  return (

    <div className="App">

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
