import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Input } from './components';

/* ===== COMMAND PALETTE COMPONENT ===== */

export interface Command {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  category?: string;
  action: () => void;
  keywords?: string[];
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  recent?: Command[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  recent = [],
  placeholder = "Search commands..."
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show recent commands when no query
      setFilteredCommands(recent.length > 0 ? recent : commands.slice(0, 8));
    } else {
      const filtered = commands.filter(cmd => {
        const searchText = `${cmd.title} ${cmd.description || ''} ${cmd.keywords?.join(' ') || ''}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
      setFilteredCommands(filtered.slice(0, 10));
    }
    setSelectedIndex(0);
  }, [query, commands, recent]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
            setQuery('');
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay">
      <div className="command-palette-backdrop" onClick={onClose} />
      <div className="command-palette">
        <div className="command-palette-header">
          <div className="command-palette-search">
            <SearchIcon />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="command-palette-input"
            />
          </div>
        </div>

        <div className="command-palette-content">
          {filteredCommands.length > 0 ? (
            <div ref={listRef} className="command-list">
              {!query && recent.length > 0 && (
                <div className="command-section">
                  <Text variant="label-sm" color="tertiary" className="command-section-title">
                    Recent
                  </Text>
                </div>
              )}
              
              {filteredCommands.map((command, index) => (
                <CommandItem
                  key={command.id}
                  command={command}
                  isSelected={index === selectedIndex}
                  onClick={() => {
                    command.action();
                    onClose();
                    setQuery('');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="command-palette-empty">
              <Text variant="body-md" color="secondary">
                No commands found for "{query}"
              </Text>
            </div>
          )}
        </div>

        <div className="command-palette-footer">
          <div className="command-palette-shortcuts">
            <KeyboardShortcut keys={['↑', '↓']} description="Navigate" />
            <KeyboardShortcut keys={['Enter']} description="Select" />
            <KeyboardShortcut keys={['Esc']} description="Close" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== COMMAND ITEM COMPONENT ===== */

interface CommandItemProps {
  command: Command;
  isSelected: boolean;
  onClick: () => void;
}

const CommandItem: React.FC<CommandItemProps> = ({ command, isSelected, onClick }) => {
  return (
    <div
      className={`command-item ${isSelected ? 'command-item-selected' : ''}`}
      onClick={onClick}
    >
      <div className="command-item-content">
        {command.icon && (
          <div className="command-item-icon">{command.icon}</div>
        )}
        <div className="command-item-text">
          <Text variant="label-md" color="primary" className="command-item-title">
            {command.title}
          </Text>
          {command.description && (
            <Text variant="body-sm" color="secondary" className="command-item-description">
              {command.description}
            </Text>
          )}
        </div>
      </div>
      {command.shortcut && (
        <div className="command-item-shortcut">
          <kbd className="kbd">{command.shortcut}</kbd>
        </div>
      )}
    </div>
  );
};

/* ===== KEYBOARD SHORTCUT COMPONENT ===== */

interface KeyboardShortcutProps {
  keys: string[];
  description: string;
}

const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({ keys, description }) => {
  return (
    <div className="keyboard-shortcut">
      <div className="keyboard-shortcut-keys">
        {keys.map((key, index) => (
          <kbd key={index} className="kbd-small">
            {key}
          </kbd>
        ))}
      </div>
      <Text variant="body-sm" color="tertiary">
        {description}
      </Text>
    </div>
  );
};

/* ===== COMMAND PALETTE HOOK ===== */

export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands: Command[] = [
    // Navigation Commands
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      description: 'View system overview and metrics',
      icon: <DashboardIcon />,
      shortcut: 'g d',
      category: 'Navigation',
      action: () => navigate('/admin/dashboard'),
      keywords: ['dashboard', 'home', 'overview']
    },
    {
      id: 'nav-analytics',
      title: 'Go to Analytics',
      description: 'View detailed analytics and reports',
      icon: <AnalyticsIcon />,
      shortcut: 'g a',
      category: 'Navigation',
      action: () => navigate('/admin/analytics'),
      keywords: ['analytics', 'reports', 'metrics']
    },
    {
      id: 'nav-contacts',
      title: 'Go to Contacts',
      description: 'Manage contact submissions',
      icon: <ContactsIcon />,
      shortcut: 'g c',
      category: 'Navigation',
      action: () => navigate('/admin/contacts'),
      keywords: ['contacts', 'submissions', 'leads']
    },
    {
      id: 'nav-users',
      title: 'Go to Admin Users',
      description: 'Manage administrator accounts',
      icon: <UsersIcon />,
      shortcut: 'g u',
      category: 'Navigation',
      action: () => navigate('/admin/users'),
      keywords: ['users', 'admins', 'accounts']
    },
    {
      id: 'nav-audit',
      title: 'Go to Audit Logs',
      description: 'Review system activity logs',
      icon: <AuditIcon />,
      shortcut: 'g l',
      category: 'Navigation',
      action: () => navigate('/admin/audit'),
      keywords: ['audit', 'logs', 'activity']
    },

    // Action Commands
    {
      id: 'action-new-contact',
      title: 'Create New Contact',
      description: 'Add a new contact manually',
      icon: <PlusIcon />,
      shortcut: 'cmd+n',
      category: 'Actions',
      action: () => navigate('/admin/contacts/new'),
      keywords: ['create', 'new', 'add', 'contact']
    },
    {
      id: 'action-search',
      title: 'Search Everything',
      description: 'Global search across all data',
      icon: <SearchIcon />,
      shortcut: 'cmd+f',
      category: 'Actions',
      action: () => {
        // Focus search input when implemented
        console.log('Global search');
      },
      keywords: ['search', 'find', 'lookup']
    },
    {
      id: 'action-refresh',
      title: 'Refresh Data',
      description: 'Reload current page data',
      icon: <RefreshIcon />,
      shortcut: 'cmd+r',
      category: 'Actions',
      action: () => window.location.reload(),
      keywords: ['refresh', 'reload', 'update']
    },

    // View Commands
    {
      id: 'view-new-contacts',
      title: 'View New Contacts',
      description: 'Show contacts awaiting review',
      icon: <NewContactsIcon />,
      category: 'Views',
      action: () => navigate('/admin/contacts?status=NEW'),
      keywords: ['new', 'pending', 'review']
    },
    {
      id: 'view-urgent',
      title: 'View Urgent Items',
      description: 'Show high priority contacts',
      icon: <UrgentIcon />,
      category: 'Views',
      action: () => navigate('/admin/contacts?priority=URGENT'),
      keywords: ['urgent', 'priority', 'important']
    }
  ];

  return {
    isOpen,
    setIsOpen,
    commands,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  };
};

/* ===== ICON COMPONENTS ===== */

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const ContactsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m22 21-3-3"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const AuditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const NewContactsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="24" y2="8"/>
    <line x1="22" y1="5" x2="22" y2="11"/>
  </svg>
);

const UrgentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default CommandPalette;
