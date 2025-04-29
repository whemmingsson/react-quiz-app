import { Outlet } from "react-router-dom";
import "./App.css";
import TopBar from "./components/TopBar";

function Layout() {
  return (
    <div>
      <header>
        <TopBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
