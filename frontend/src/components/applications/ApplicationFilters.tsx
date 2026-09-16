import type { ApplicationStatus } from "../../types";
import { APPLICATION_STATUSES } from "../../types";

interface ApplicationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeStatus: ApplicationStatus | "All";
  onStatusChange: (status: ApplicationStatus | "All") => void;
}

const filterOptions: (ApplicationStatus | "All")[] = ["All", ...APPLICATION_STATUSES];

export default function ApplicationFilters({
  searchTerm,
  onSearchChange,
  activeStatus,
  onStatusChange,
}: ApplicationFiltersProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search applications"
        />
      </div>

      <div className="filter-pills" role="group" aria-label="Filter by status">
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            className="filter-pill"
            aria-pressed={activeStatus === option}
            onClick={() => onStatusChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
