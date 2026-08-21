import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * AppLayout — the main application shell.
 * - hideSidebar: removes sidebar (used for login/signup)
 * - title/subtitle: passed to the top Header
 */
export default function AppLayout({ children, title, subtitle, hideSidebar = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#F8F7FC' }}>
      {/* Sidebar */}
      {!hideSidebar && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
        }}
        className={hideSidebar ? '' : 'md:ml-[250px]'}
      >
        <Header
          title={title}
          subtitle={subtitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main
          style={{
            flex: 1,
            padding: '2.25rem 2.5rem',
            width: '100%',
            boxSizing: 'border-box',
            maxWidth: '1100px',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
