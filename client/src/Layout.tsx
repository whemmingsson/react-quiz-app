import { Outlet } from "react-router-dom";
import "./App.css";
import ConnectionButtons from "./components/ConnectionButtons";

function Layout() {
  return (
    <div>
      <ConnectionButtons />
      <header>
        <h1>FINQZ</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
