"use client"

import { NewEventFilters } from '@/components/NewFilters';
import Pagination from '@/components/Pagination';
import { motion } from 'framer-motion';
import { use } from 'react';
import EventCard from './EventCard';

export interface MyEventsContainerProps
{
    eventsPromise: Promise<any>;
}

const MyEventsContainer = ( { eventsPromise }: MyEventsContainerProps ) =>
{
    const myEventsData = use( eventsPromise );
    // console.log( myEventsData?.data )
    
    return (
        <div className="min-h-screen bg-background py-10">
            <div className="pt-24 pb-12">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            View all of your{" "}
                            <span className="bg-gradient-primary bg-clip-text text-transparent">
                                Events
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Find your next adventure and connect with amazing people
                        </p>
                    </motion.div>
                    

                    {/* filter */}
                    <NewEventFilters
                        totalResults={myEventsData?.data?.pagination?.total || 0}
                        enabledFilters={{
                            search: true,
                            category: true,
                            status: true,
                        }}
                    />


                    {/* events */}
                    {
                        myEventsData?.data?.events?.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
                                {
                                    myEventsData?.data?.events?.map( e => (
                                        <EventCard key={e?.id} event={e} />
                                    ) )
                                }
                            </div>
                        ) : ( <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold mb-2">No events found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your filters or search terms
                            </p>
                        </motion.div> )
                    }

                    {
                        myEventsData?.data?.events?.length > 0 && (
                            <div className='mt-20'>
                                <Pagination totalPages={myEventsData?.data?.pagination?.totalPages} />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default MyEventsContainer;