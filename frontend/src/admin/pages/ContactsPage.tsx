import React, { useState } from 'react';
import { AppShell } from '../components/AppShell';
import DataExplorer, { ColumnDefinition } from '../../design-system/DataExplorer';
import { Badge, Text, Button } from '../../design-system/components';

/* ===== SAMPLE DATA ===== */

interface Contact {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
  source: string;
  createdAt: string;
  lastContact?: string;
  value?: number;
  company?: string;
  phone?: string;
  actions?: any; // Add this for the actions column
}

const generateSampleContacts = (count: number): Contact[] => {
  const statuses: Contact['status'][] = ['new', 'contacted', 'qualified', 'converted', 'archived'];
  const sources = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Social Media', 'Advertisement'];
  const companies = ['Tech Corp', 'StartupXYZ', 'Enterprise Ltd', 'Innovation Inc', 'Digital Agency', 'Consulting Group'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `contact-${i + 1}`,
    name: `Contact ${i + 1}`,
    email: `contact${i + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastContact: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    value: Math.random() > 0.4 ? Math.floor(Math.random() * 50000) + 1000 : undefined,
    company: Math.random() > 0.3 ? companies[Math.floor(Math.random() * companies.length)] : undefined,
    phone: Math.random() > 0.4 ? `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined
  }));
};

export const ContactsPage: React.FC = () => {
  const [contacts] = useState<Contact[]>(generateSampleContacts(150));
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [loading] = useState(false);

  /* ===== COLUMN DEFINITIONS ===== */

  const columns: ColumnDefinition<Contact>[] = [
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
        const statusColors = {
          new: 'blue',
          contacted: 'amber',
          qualified: 'purple',
          converted: 'green',
          archived: 'neutral'
        } as const;
        
        return (
          <Badge variant={statusColors[value as keyof typeof statusColors]} size="sm">
            {value}
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
      render: (value) => (
        <Text variant="body-sm" color="secondary">
          {value}
        </Text>
      )
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
        { value: 'new', label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'qualified', label: 'Qualified' },
        { value: 'converted', label: 'Converted' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select' as const,
      options: [
        { value: 'Website', label: 'Website' },
        { value: 'LinkedIn', label: 'LinkedIn' },
        { value: 'Referral', label: 'Referral' },
        { value: 'Cold Email', label: 'Cold Email' },
        { value: 'Social Media', label: 'Social Media' },
        { value: 'Advertisement', label: 'Advertisement' }
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

  /* ===== PAGINATION CONFIG ===== */

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const paginationConfig = {
    page: currentPage,
    pageSize,
    total: contacts.length
  };

  return (
    <AppShell>
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
    </AppShell>
  );
};
