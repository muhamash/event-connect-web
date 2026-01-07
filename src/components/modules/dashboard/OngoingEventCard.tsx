"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import
    {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import
    {
        Clock,
        Edit,
        Eye,
        MoreHorizontal,
        Users,
        XCircle
    } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export default function OngoingEventCard ( { event }: any )
{
    const router = useRouter();

    return (
        <div
            key={event.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
        >
            <img
                src={event.image}
                alt={event.title}
                className="h-16 w-24 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground truncate">{event.title}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(event.date, {withTime: false})}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.participants?.length}/{event.maxParticipants}
                    </span>
                </div>
            </div>
            <div className="text-right">
                <Badge
                    className={
                        "bg-green-500/20 text-green-500"
                    }
                >
                    {event.status}
                </Badge>
                <p className="text-sm font-bold text-primary mt-1">
                    {event.joiningFee === 0 ? "Free" : `$${ event.joiningFee }`}
                </p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black" align="end">
                    <DropdownMenuItem
                        onClick={() => router.push(`events/${event?.id}`)}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`/edit-event?eventId=${event?.id}`)}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                        {
                            console.log( "Cancel event:", event.id );
                            toast.success( "Event cancelled" );
                        }}
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Event
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
