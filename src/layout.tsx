import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import AppFooter from "./components/layout/app.footer";

function Layout() {
  return (
    <div className="client-layout">
      <AppHeader />
      <main className="client-main">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default Layout;
