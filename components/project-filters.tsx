'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'

interface FilterState {
  search: string
  category: string
  budgetRange: string
  status: string
  location: string
  sortBy: 'recent' | 'budget-high' | 'budget-low'
}

const PRESETS: { label: string; filters: Partial<FilterState> }[] = [
  { label: 'Most Recent', filters: { sortBy: 'recent', category: '', budgetRange: '' } },
  { label: 'Highest Budget', filters: { sortBy: 'budget-high', category: '', budgetRange: '' } },
  { label: 'High Value', filters: { sortBy: 'budget-high', budgetRange: '10000-25000' } },
]

const SERVICE_CATEGORIES = [
  { value: 'tree-removal', label: 'Tree Removal' },
  { value: 'concrete-work', label: 'Concrete Work' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'fencing', label: 'Fencing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'excavation', label: 'Excavation' },
]

const BUDGET_RANGES = [
  { value: '0-1000', label: 'Under $1,000' },
  { value: '1000-5000', label: '$1,000 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000-25000', label: '$10,000 - $25,000' },
  { value: '25000+', label: '$25,000+' },
]

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'completed', label: 'Completed' },
]

interface ProjectFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  showStatus?: boolean
}

export function ProjectFilters({ onFiltersChange, showStatus = false }: ProjectFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    budgetRange: '',
    status: '',
    location: '',
    sortBy: 'recent',
  })

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['search']))
  const [showAdvanced, setShowAdvanced] = useState(false)

  function toggleSection(section: string) {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  function applyPreset(preset: Partial<FilterState>) {
    const newFilters = { ...filters, ...preset }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  function clearFilters() {
    const cleared: FilterState = {
      search: '',
      category: '',
      budgetRange: '',
      status: '',
      location: '',
      sortBy: 'recent',
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'sortBy' && value !== ''
  )

  return (
    <div className="space-y-4 bg-muted/30 rounded-lg p-6 border border-border">
      {/* Quick presets */}
      <div>
        <p className="font-semibold text-foreground text-sm mb-2">Quick Filters</p>
        <div className="flex flex-col gap-1.5">
          {PRESETS.map(preset => {
            const isActive = preset.label === 'Most Recent'
              ? filters.sortBy === 'recent' && !filters.category && !filters.budgetRange
              : preset.label === 'Highest Budget'
              ? filters.sortBy === 'budget-high' && !filters.budgetRange
              : filters.sortBy === 'budget-high' && filters.budgetRange === '10000-25000'
            return (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.filters)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border hover:border-primary/40 hover:text-primary'
                }`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Search */}
      <div>
        <button
          onClick={() => toggleSection('search')}
          className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded"
        >
          <span className="font-semibold text-foreground">Search</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.has('search') ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.has('search') && (
          <div className="mt-3 space-y-2">
            <Input
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded"
        >
          <span className="font-semibold text-foreground">Service Category</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.has('category') ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.has('category') && (
          <div className="mt-3 space-y-2">
            {SERVICE_CATEGORIES.map(cat => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={filters.category === cat.value}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{cat.label}</span>
              </label>
            ))}
            {filters.category && (
              <button
                onClick={() => updateFilter('category', '')}
                className="text-xs text-primary hover:underline"
              >
                Clear selection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Budget Range */}
      <div>
        <button
          onClick={() => toggleSection('budget')}
          className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded"
        >
          <span className="font-semibold text-foreground">Budget Range</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.has('budget') ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.has('budget') && (
          <div className="mt-3 space-y-2">
            {BUDGET_RANGES.map(range => (
              <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="budget"
                  value={range.value}
                  checked={filters.budgetRange === range.value}
                  onChange={(e) => updateFilter('budgetRange', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{range.label}</span>
              </label>
            ))}
            {filters.budgetRange && (
              <button
                onClick={() => updateFilter('budgetRange', '')}
                className="text-xs text-primary hover:underline"
              >
                Clear selection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded"
        >
          <span className="font-semibold text-foreground">Location</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.has('location') ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.has('location') && (
          <div className="mt-3 space-y-2">
            <Input
              placeholder="City, State"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(v => !v)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Advanced options
        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </button>

      {showAdvanced && (
        <>
          {/* Status (if applicable) */}
          {showStatus && (
            <div>
              <button
                onClick={() => toggleSection('status')}
                className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded"
              >
                <span className="font-semibold text-foreground">Status</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.has('status') ? 'rotate-180' : ''}`} />
              </button>
              {expandedSections.has('status') && (
                <div className="mt-3 space-y-2">
                  {STATUS_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={filters.status === opt.value}
                        onChange={(e) => updateFilter('status', e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </label>
                  ))}
                  {filters.status && (
                    <button
                      onClick={() => updateFilter('status', '')}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear selection
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sort */}
          <div>
            <button
              onClick={() => toggleSection('sort')}
              className="flex items-center justify-between w-full py-2 hover:bg-muted/50 px-2 rounded"
            >
              <span className="font-semibold text-foreground">Sort By</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.has('sort') ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.has('sort') && (
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="recent"
                    checked={filters.sortBy === 'recent'}
                    onChange={(e) => updateFilter('sortBy', e.target.value as 'recent' | 'budget-high' | 'budget-low')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Most Recent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="budget-high"
                    checked={filters.sortBy === 'budget-high'}
                    onChange={(e) => updateFilter('sortBy', e.target.value as 'recent' | 'budget-high' | 'budget-low')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Highest Budget</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="budget-low"
                    checked={filters.sortBy === 'budget-low'}
                    onChange={(e) => updateFilter('sortBy', e.target.value as 'recent' | 'budget-high' | 'budget-low')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Lowest Budget</span>
                </label>
              </div>
            )}
          </div>
        </>
      )}

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full gap-2"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
