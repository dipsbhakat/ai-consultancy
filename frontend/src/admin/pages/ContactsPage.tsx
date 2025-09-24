import React, { useEffect, useMemo, useState } from 'react';
import DataExplorer, { ColumnDefinition } from '../../design-system/DataExplorer';
import { Badge, Text, Button } from '../../design-system/components';
import { adminAPI } from '../hooks/useAdminAPI';
import { ContactSubmission, ContactStatus, ContactSource } from '../types';

/* ===== BACKEND-WIRED DATA ===== */

// Extend backend contact to include a couple of computed UI fields
type ContactRow = ContactSubmission & {
  lastContact?: string; // derived from respondedAt or updatedAt for display
  value?: number; // optional placeholder (not provided by backend)
  actions?: any; // to satisfy DataExplorer actions column typings
};

export const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [total, setTotal] = useState(0);

  /* ===== COLUMN DEFINITIONS ===== */

  const columns: ColumnDefinition<ContactRow>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      filterable: true,
      width: '200px',
      render: (value, row) => (
        <div className="flex flex-col">
          <Text variant="label-sm" weight="medium" color="primary">
            {value}
          </Text>
          <Text variant="body-sm" color="secondary">
            {row.email}
          </Text>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (value) => {
        // Map backend enum to badge variants + human label
        const variantMap: Record<ContactStatus, 'blue' | 'amber' | 'green' | 'neutral' | 'purple' | 'red'> = {
          [ContactStatus.NEW]: 'blue',
          [ContactStatus.IN_REVIEW]: 'amber',
          [ContactStatus.RESOLVED]: 'green',
          [ContactStatus.ARCHIVED]: 'neutral',
        };
        const label = String(value).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        return (
          <Badge variant={variantMap[value as ContactStatus] || 'neutral'} size="sm">
            {label}
          </Badge>
        );
      }
    },
    {
      key: 'source',
      title: 'Source',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (value) => {
        const label = String(value).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        return (
          <Text variant="body-sm" color="secondary">
            {label}
          </Text>
        );
      }
    },
    {
      key: 'company',
      title: 'Company',
      sortable: true,
      filterable: true,
      width: '150px',
      render: (value) => (
        <Text variant="body-sm" color={value ? 'primary' : 'tertiary'}>
          {value || '—'}
        </Text>
      )
    },
    {
      key: 'value',
      title: 'Est. Value',
      sortable: true,
      type: 'number',
      width: '120px',
      align: 'right',
      render: (value) => (
        <Text variant="body-sm" color={value ? 'primary' : 'tertiary'} weight={value ? 'medium' : 'regular'}>
          {value ? `$${value.toLocaleString()}` : '—'}
        </Text>
      )
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      type: 'date',
      width: '120px',
      render: (value) => (
        <Text variant="body-sm" color="secondary">
          {new Date(value).toLocaleDateString()}
        </Text>
      )
    },
    {
      key: 'lastContact',
      title: 'Last Contact',
      sortable: true,
      type: 'date',
      width: '120px',
      render: (value) => (
        <Text variant="body-sm" color={value ? 'secondary' : 'tertiary'}>
          {value ? new Date(value).toLocaleDateString() : '—'}
        </Text>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewContact(row.id)}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditContact(row.id)}>
            Edit
          </Button>
        </div>
      )
    }
  ];

  /* ===== FILTER CONFIGURATIONS ===== */

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: ContactStatus.NEW, label: 'New' },
        { value: ContactStatus.IN_REVIEW, label: 'In Review' },
        { value: ContactStatus.RESOLVED, label: 'Resolved' },
        { value: ContactStatus.ARCHIVED, label: 'Archived' }
      ]
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select' as const,
      options: [
        { value: ContactSource.WEBSITE, label: 'Website' },
        { value: ContactSource.EMAIL, label: 'Email' },
        { value: ContactSource.REFERRAL, label: 'Referral' },
        { value: ContactSource.SOCIAL_MEDIA, label: 'Social Media' },
        { value: ContactSource.OTHER, label: 'Other' }
      ]
    },
    {
      key: 'company',
      label: 'Company',
      type: 'text' as const,
      placeholder: 'Filter by company...'
    }
  ];

  /* ===== EVENT HANDLERS ===== */

  const handleViewContact = (contactId: string) => {
    console.log('View contact:', contactId);
    // Navigate to contact detail page
  };

  const handleEditContact = (contactId: string) => {
    console.log('Edit contact:', contactId);
    // Open edit modal or navigate to edit page
  };

  const handleExport = () => {
    console.log('Export contacts');
    // Export functionality
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} on contacts:`, selectedContacts);
    // Handle bulk actions
  };

  /* ===== PAGINATION + DATA FETCH ===== */

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    let isMounted = true;
    const fetchContacts = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const res = await adminAPI.getContacts({ page: currentPage, limit: pageSize });
        if (!isMounted) return;
        const rows: ContactRow[] = res.contacts.map(c => ({
          ...c,
          lastContact: c.respondedAt || c.updatedAt,
          // value intentionally left undefined unless backend adds it later
        }));
        setContacts(rows);
        setTotal(res.pagination.total);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load contacts');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchContacts();
    return () => { isMounted = false; };
  }, [currentPage]);

  const paginationConfig = useMemo(() => ({
    page: currentPage,
    pageSize,
    total
  }), [currentPage, pageSize, total]);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <Text variant="body-md" color="secondary">
              Manage your contact database and lead pipeline
            </Text>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedContacts.length > 0 && (
              <div className="flex items-center gap-2">
                <Text variant="body-sm" color="secondary">
                  {selectedContacts.length} selected
                </Text>
                <Button variant="ghost" size="sm" onClick={() => handleBulkAction('archive')}>
                  Archive
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleBulkAction('export')}>
                  Export
                </Button>
              </div>
            )}
            
            <Button variant="primary" onClick={() => console.log('Add contact')}>
              Add Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Data Explorer */}
      <DataExplorer
        data={contacts}
        columns={columns}
  loading={loading}
  error={error}
        filters={filters}
        pagination={paginationConfig}
        onPageChange={setCurrentPage}
        selection={{
          enabled: true,
          selected: selectedContacts,
          onSelectionChange: setSelectedContacts,
          getRowId: (row) => row.id
        }}
        searchable={true}
        exportable={true}
        onExport={handleExport}
        emptyState={{
          title: 'No contacts found',
          description: 'Get started by adding your first contact or adjust your search filters.',
          action: {
            label: 'Add Contact',
            onClick: () => console.log('Add contact')
          }
        }}
      />
    </div>
  );
};
