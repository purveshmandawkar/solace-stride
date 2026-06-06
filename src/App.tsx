import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Goals from "./pages/Goals";
import Me from "./pages/Me";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/me" element={<Me />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
