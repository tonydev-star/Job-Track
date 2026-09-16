import { NavLinks } from "./Sidebar";

interface MobileNavProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function MobileNav({ onClose, onLogout }: MobileNavProps) {
  return (
    <>
      <div className="mobile-nav-backdrop" onClick={onClose} />
      <div className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Navigation">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark" aria-hidden="true" />
          <span className="sidebar-brand-name">JobTrack</span>
        </div>

        <NavLinks onNavigate={onClose} />

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-link"
            style={{ width: "100%" }}
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            <span className="sidebar-link-label">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
