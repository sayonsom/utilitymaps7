import FilterPanel from '../components/FilterPanel';

export default {
  title: 'Components/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'light-gray', value: '#f0f0f0' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onFilterChange: { action: 'filter changed' }
  },
};

// Default empty state
export const Empty = {
  args: {
    filters: {
      status: [],
      risk: [],
      impact: [],
      owner: [],
    },
  },
};

// State with some filters pre-selected
export const WithPreselectedFilters = {
  args: {
    filters: {
      status: ['Real-Time(<6hours)', 'Real-Time(<3days)'],
      risk: ['High'],
      impact: ['Medium'],
      owner: ['Sayonsom'],
    },
  },
};

// State with all filters selected
export const AllFiltersSelected = {
  args: {
    filters: {
      status: [
        'Real-Time(<6hours)',
        'Real-Time(<3days)',
        'EstimatedMonthly',
        'EstimatedAnnually',
        'EstimatedHistorically',
        'Not Available'
      ],
      risk: ['Low', 'Medium', 'High'],
      impact: ['Low', 'Medium', 'High'],
      owner: ['Neelaksh', 'Sayonsom', 'Hari', 'Prathmesh', 'Riktesh', 'Rahul', 'Not assigned'],
    },
  },
};

// State focusing on risk levels
export const RiskFiltersOnly = {
  args: {
    filters: {
      status: [],
      risk: ['High', 'Medium'],
      impact: [],
      owner: [],
    },
  },
};

// State focusing on ownership
export const OwnershipFiltersOnly = {
  args: {
    filters: {
      status: [],
      risk: [],
      impact: [],
      owner: ['Sayonsom', 'Hari', 'Not assigned'],
    },
  },
}; 