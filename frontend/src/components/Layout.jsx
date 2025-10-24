// frontend/src/components/Layout.jsx
import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-5xl mx-auto p-4">{children}</main>
    </div>
  );
}
