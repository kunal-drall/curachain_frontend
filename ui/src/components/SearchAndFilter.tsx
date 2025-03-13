
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Filter, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

const statusFilters: FilterOption[] = [
  { 
    label: 'All Cases', 
    value: 'all' 
  },
  { 
    label: 'Verified', 
    value: 'verified',
    icon: <CheckCircle2 size={16} className="text-green-600" />
  },
  { 
    label: 'Pending', 
    value: 'pending',
    icon: <Clock size={16} className="text-yellow-500" />
  },
  { 
    label: 'Urgent', 
    value: 'urgent',
    icon: <AlertCircle size={16} className="text-red-500" />
  }
];

const conditionFilters: FilterOption[] = [
  { label: 'All Conditions', value: 'all' },
  { label: 'Cancer', value: 'cancer' },
  { label: 'Heart Disease', value: 'heart-disease' },
  { label: 'Neurological', value: 'neurological' },
  { label: 'Pediatric', value: 'pediatric' },
  { label: 'Rare Disease', value: 'rare-disease' },
  { label: 'Transplant', value: 'transplant' },
  { label: 'Other', value: 'other' }
];

const locationFilters: FilterOption[] = [
  { label: 'All Locations', value: 'all' },
  { label: 'North America', value: 'north-america' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia', value: 'asia' },
  { label: 'Africa', value: 'africa' },
  { label: 'South America', value: 'south-america' },
  { label: 'Australia', value: 'australia' }
];

interface SearchAndFilterProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: {
    status: string;
    condition: string;
    location: string;
    sortBy: string;
  }) => void;
  className?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilterChange,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    condition: 'all',
    location: 'all',
    sortBy: 'newest'
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };
  
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search for cases..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            showFilters && 'border-primary text-primary'
          )}
        >
          {showFilters ? <X size={16} className="mr-2" /> : <Filter size={16} className="mr-2" />}
          {showFilters ? 'Hide Filters' : 'Filter'}
          <span className="ml-1.5 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {Object.values(filters).filter(v => v !== 'all' && v !== 'newest').length}
          </span>
        </Button>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-secondary rounded-lg animate-scale-in">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Status</label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {option.icon && <span className="mr-2">{option.icon}</span>}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1.5 block">Medical Condition</label>
            <Select 
              value={filters.condition} 
              onValueChange={(value) => handleFilterChange('condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent>
                {conditionFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1.5 block">Location</label>
            <Select 
              value={filters.location} 
              onValueChange={(value) => handleFilterChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {locationFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1.5 block">Sort By</label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="urgency">Urgency</SelectItem>
                <SelectItem value="goal-asc">Funding Goal (Low to High)</SelectItem>
                <SelectItem value="goal-desc">Funding Goal (High to Low)</SelectItem>
                <SelectItem value="progress">Funding Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
