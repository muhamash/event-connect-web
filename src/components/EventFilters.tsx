import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, MapPin, Calendar, DollarSign } from "lucide-react";
import { eventCategories } from "@/data/mockData";

export interface FilterState {
  search: string;
  category: string;
  location: string;
  dateRange: string;
  priceRange: [number, number];
}

interface EventFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
}

export const EventFilters = ({
  filters,
  onFilterChange,
  totalResults,
}: EventFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      location: "",
      dateRange: "",
      priceRange: [0, 200],
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.location,
    filters.dateRange,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 200,
  ].filter(Boolean).length;

  const locations = [
    "New York",
    "Los Angeles",
    "San Francisco",
    "Denver",
    "Chicago",
    "Miami",
  ];

  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "this-week", label: "This Week" },
    { value: "this-weekend", label: "This Weekend" },
    { value: "next-week", label: "Next Week" },
    { value: "this-month", label: "This Month" },
  ];

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search events, hosts, locations..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex gap-3">
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter("category", value)}
            >
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {eventCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.location}
              onValueChange={(value) => updateFilter("location", value)}
            >
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(value) => updateFilter("dateRange", value)}
            >
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Date</SelectItem>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="lg:hidden border-border hover:border-primary relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-border">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Category */}
                <div className="space-y-3">
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {eventCategories.map((category) => (
                      <Badge
                        key={category}
                        variant={
                          filters.category === category ? "default" : "outline"
                        }
                        className={`cursor-pointer ${
                          filters.category === category
                            ? "bg-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        }`}
                        onClick={() =>
                          updateFilter(
                            "category",
                            filters.category === category ? "" : category
                          )
                        }
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                  </Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => updateFilter("location", value)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Date
                  </Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => updateFilter("dateRange", value)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Date</SelectItem>
                      {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Price Range
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        updateFilter("priceRange", value)
                      }
                      max={200}
                      step={5}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${filters.priceRange[0]}</span>
                      <span>
                        ${filters.priceRange[1]}
                        {filters.priceRange[1] === 200 ? "+" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-border"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters & Results Count */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalResults} events found
          </span>

          <AnimatePresence>
            {(filters.category ||
              filters.location ||
              filters.dateRange ||
              filters.priceRange[0] > 0 ||
              filters.priceRange[1] < 200) && (
              <>
                <span className="text-muted-foreground">•</span>
                {filters.category && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary cursor-pointer"
                      onClick={() => updateFilter("category", "")}
                    >
                      {filters.category}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  </motion.div>
                )}
                {filters.location && filters.location !== "all" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary cursor-pointer"
                      onClick={() => updateFilter("location", "")}
                    >
                      {filters.location}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  </motion.div>
                )}
                {filters.dateRange && filters.dateRange !== "all" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary cursor-pointer"
                      onClick={() => updateFilter("dateRange", "")}
                    >
                      {dateRanges.find((r) => r.value === filters.dateRange)
                        ?.label || filters.dateRange}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  </motion.div>
                )}
                {(filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < 200) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary cursor-pointer"
                      onClick={() => updateFilter("priceRange", [0, 200])}
                    >
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      {filters.priceRange[1] === 200 ? "+" : ""}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  </motion.div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-auto p-1"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
