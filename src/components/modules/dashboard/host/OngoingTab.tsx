"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import
    {
        ChevronLeft,
        ChevronRight,
        Link2
    } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import OngoingEventCard from "../OngoingEventCard";

interface OngoingTabProps
{
    eventsPromise: Promise<any>;
}

export default function OngoingTab ({eventsPromise}: OngoingTabProps)
{
    const eventData = use( eventsPromise )?.data;
    const router = useRouter();
    const searchParams = useSearchParams();
    console.log( eventData );
      
    const currentPage = eventData?.pagination?.page || 1;
    const totalPages = eventData?.pagination?.totalPages || 1;;
    const total = eventData?.pagination?.total || 0;

    
    const handlePageChange = ( newPage: number ) =>
    {
        const params = new URLSearchParams( searchParams.toString() );
        params.set( 'page', newPage.toString() );
        router.push( `?${ params.toString() }` );
    };
    
    return (
        <TabsContent value="events" className="space-y-6">
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Ongoing Hosted Events</CardTitle>
                    <Link href={"/my-events"} className="bg-gradient-primary flex items-center justify-center shadow-md rounded-md px-3 py-2">
                        <Link2 className="h-4 w-4 mr-2" />
                        View all
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {eventData?.events?.map( ( event ) => (
                            <OngoingEventCard key={event?.id} event={event} />
                        ) )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                            <div className="text-sm text-muted-foreground">
                                Showing page {currentPage} of {totalPages} ({total} total events)
                            </div>
                  
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange( currentPage - 1 )}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                    
                                <div className="flex items-center gap-1">
                                    {Array.from( { length: totalPages }, ( _, i ) => i + 1 ).map( ( page ) => (
                                        <Button
                                            key={page}
                                            variant={page === currentPage ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange( page )}
                                            className="h-8 w-8 p-0"
                                        >
                                            {page}
                                        </Button>
                                    ) )}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange( currentPage + 1 )}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    );
};