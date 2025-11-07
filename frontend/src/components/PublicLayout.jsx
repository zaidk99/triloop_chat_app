import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <div className="min-h-[calc(100vh-100px)]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}