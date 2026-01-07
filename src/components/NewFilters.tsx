'use client';

import { eventCategories } from "@/components/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import
    {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "@/components/ui/select";
import
    {
        Sheet,
        SheetContent,
        SheetHeader,
        SheetTitle,
        SheetTrigger,
    } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/useDebounce";
import { EventStatus } from "@/lib/constants/enum.constant";
import { Calendar, DollarSign, Filter, MapPin, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



export interface FilterState {
  search?: string;
  category?: string;
  location?: string;
  dateRange?: string;
  priceRange?: [number, number];
  status?: EventStatus | string;
}

interface EventFiltersProps {
  totalResults: number;
  enabledFilters?: Partial<Record<keyof FilterState, boolean>>; 
}

export const NewEventFilters = ( {
    totalResults,
    enabledFilters = {
        search: true,
        category: true,
        location: true,
        dateRange: true,
        priceRange: true,
        status: true,
    },
}: EventFiltersProps ) =>
{
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get filters from URL
    const filters: FilterState = {
        search: searchParams.get( "search" ) || "",
        category: searchParams.get( "category" ) || "",
        location: searchParams.get( "location" ) || "",
        dateRange: searchParams.get( "dateRange" ) || "",
        priceRange: [
            Number( searchParams.get( "priceMin" ) || 0 ),
            Number( searchParams.get( "priceMax" ) || 200 ),
        ],
        status: searchParams.get( "status" ) || "",
    };

    const updateFilter = ( key: keyof FilterState, value: any ) =>
    {
        const newParams = new URLSearchParams( searchParams.toString() );

        if ( key === "priceRange" )
        {
            newParams.set( "priceMin", value[ 0 ] );
            newParams.set( "priceMax", value[ 1 ] );
        } else
        {
            if ( value ) newParams.set( key, value );
            else newParams.delete( key );
        }
        newParams.set( "page", "1" ); 
        router.push( `?${ newParams.toString() }` );
    };

    const [searchInput, setSearchInput] = useState(filters.search || "");
    const debouncedSearch = useDebounce( searchInput, 500 );
    const [ isOpen, setIsOpen ] = useState( false );

    useEffect( () =>
    {
        if ( !enabledFilters.search ) return;

        if ( debouncedSearch !== filters.search )
        {
            updateFilter( "search", debouncedSearch );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ debouncedSearch ] );

    const clearFilters = () =>
    {
        router.push( `?page=1` );
    };

    const activeFiltersCount = [
        filters.category && filters.category !== "all",
        filters.location && filters.location !== "all",
        filters.dateRange && filters.dateRange !== "all",
        filters.priceRange && ( filters.priceRange[ 0 ] > 0 || filters.priceRange[ 1 ] < 200 ),
        filters.status,
        filters.search,
    ].filter( Boolean ).length;

    const locations = [ "New York", "Los Angeles", "San Francisco", "Denver", "Chicago", "Miami" ];
    const dateRanges = [
        { value: "today", label: "Today" },
        { value: "tomorrow", label: "Tomorrow" },
        { value: "this-week", label: "This Week" },
        { value: "this-weekend", label: "This Weekend" },
        { value: "next-week", label: "Next Week" },
        { value: "this-month", label: "This Month" },
    ];

    const statuses = Object.values( EventStatus );

    return (
        <Card className="bg-card border-border my-10 py-5">
            <CardContent className="p-6">
                {/* Search + Desktop Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {enabledFilters.search && (
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search events, hosts, locations..."
                                value={searchInput}
                                onChange={( e ) => setSearchInput( e.target.value )}
                                className="pl-10 bg-background border-border"
                            />

                        </div>
                    )}

                    <div className="hidden lg:flex gap-3">
                        {enabledFilters.category && (
                            <Select
                                value={filters.category || "all"}
                                onValueChange={( value ) => updateFilter( "category", value === "all" ? "" : value )}
                            >
                                <SelectTrigger className="w-[160px] bg-background border-border">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {eventCategories.map( ( category ) => (
                                        <SelectItem className="bg-black" key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ) )}
                                </SelectContent>
                            </Select>
                        )}

                        {enabledFilters.location && (
                            <Select
                                value={filters.location || "all"}
                                onValueChange={( value ) => updateFilter( "location", value === "all" ? "" : value )}
                            >
                                <SelectTrigger className="w-[160px] bg-background border-border">
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {locations.map( ( location ) => (
                                        <SelectItem className="bg-black" key={location} value={location}>
                                            {location}
                                        </SelectItem>
                                    ) )}
                                </SelectContent>
                            </Select>
                        )}

                        {enabledFilters.dateRange && (
                            <Select
                                value={filters.dateRange || "all"}
                                onValueChange={( value ) => updateFilter( "dateRange", value === "all" ? "" : value )}
                            >
                                <SelectTrigger className="w-[160px] bg-background border-border">
                                    <SelectValue placeholder="Date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Date</SelectItem>
                                    {dateRanges.map( ( range ) => (
                                        <SelectItem className="bg-black" key={range.value} value={range.value}>
                                            {range.label}
                                        </SelectItem>
                                    ) )}
                                </SelectContent>
                            </Select>
                        )}

                        {enabledFilters.status && (
                            <Select
                                value={filters.status || "all"}
                                onValueChange={( value ) => updateFilter( "status", value === "all" ? "" : value )}
                            >
                                <SelectTrigger className="w-[160px] bg-background border-border">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statuses.map( ( status ) => (
                                        <SelectItem className="bg-black" key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ) )}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Mobile Filter Button */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="lg:hidden border-border hover:border-primary relative">
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
                                {/* Render each enabled filter in mobile sheet */}
                                {enabledFilters.category && (
                                    <div className="space-y-3">
                                        <Label>Category</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {eventCategories.map( ( category ) => (
                                                <Badge
                                                    key={category}
                                                    variant={filters.category === category ? "default" : "outline"}
                                                    className={`cursor-pointer ${ filters.category === category
                                                        ? "bg-primary text-primary-foreground"
                                                        : "border-border hover:border-primary"
                                                        }`}
                                                    onClick={() =>
                                                        updateFilter( "category", filters.category === category ? "" : category )
                                                    }
                                                >
                                                    {category}
                                                </Badge>
                                            ) )}
                                        </div>
                                    </div>
                                )}

                                {enabledFilters.location && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            Location
                                        </Label>
                                        <Select
                                            value={filters.location || "all"}
                                            onValueChange={( value ) => updateFilter( "location", value === "all" ? "" : value )}
                                        >
                                            <SelectTrigger className="bg-background border-border">
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Locations</SelectItem>
                                                {locations.map( ( location ) => (
                                                    <SelectItem key={location} value={location}>
                                                        {location}
                                                    </SelectItem>
                                                ) )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {enabledFilters.dateRange && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            Date
                                        </Label>
                                        <Select
                                            value={filters.dateRange || "all"}
                                            onValueChange={( value ) => updateFilter( "dateRange", value === "all" ? "" : value )}
                                        >
                                            <SelectTrigger className="bg-background border-border">
                                                <SelectValue placeholder="Select date range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Any Date</SelectItem>
                                                {dateRanges.map( ( range ) => (
                                                    <SelectItem key={range.value} value={range.value}>
                                                        {range.label}
                                                    </SelectItem>
                                                ) )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {enabledFilters.status && (
                                    <div className="space-y-3">
                                        <Label>Status</Label>
                                        <Select
                                            value={filters.status || "all"}
                                            onValueChange={( value ) => updateFilter( "status", value === "all" ? "" : value )}
                                        >
                                            <SelectTrigger className="bg-background border-border">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                {statuses.map( ( status ) => (
                                                    <SelectItem className="bg-black" key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ) )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {enabledFilters.priceRange && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-primary" />
                                            Price Range
                                        </Label>
                                        <div className="px-2">
                                            <Slider
                                                value={filters.priceRange || [ 0, 200 ]}
                                                onValueChange={( value ) => updateFilter( "priceRange", value )}
                                                max={200}
                                                step={5}
                                                className="my-4"
                                            />
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>${filters.priceRange?.[ 0 ]}</span>
                                                <span>
                                                    ${filters.priceRange?.[ 1 ]}
                                                    {filters.priceRange?.[ 1 ] === 200 ? "+" : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" className="flex-1 border-border" onClick={clearFilters}>
                                        Clear All
                                    </Button>
                                    <Button className="flex-1 bg-gradient-primary" onClick={() => router.refresh()}>
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Active Filters & Results Count */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">{totalResults} events found</span>
                </div>
            </CardContent>
        </Card>
    );
};