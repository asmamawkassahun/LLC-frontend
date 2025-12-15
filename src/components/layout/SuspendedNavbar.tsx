import { useState } from "react";
import { GoQuestion } from "react-icons/go";
import { Button } from "../ui";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import HelpDialog from "@/components/help/HelpDialog";
import { useQuery } from "@tanstack/react-query";
import supportService from "@/services/supportService";
import authService from "@/services/authService";

const SuspendedNavbar = () => {
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);

    // Fetch tickets for unread count badge
    const { data: ticketsData } = useQuery({
        queryKey: ['support-tickets'],
        queryFn: async () => {
            try {
                const response = await supportService.getTickets(1, 50);
                return response;
            } catch (error) {
                return { data: [], total: 0 };
            }
        },
        enabled: authService.isAuthenticated(),
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    // Calculate total unread messages across all tickets
    const getTotalUnreadCount = (): number => {
        if (!ticketsData?.data || !Array.isArray(ticketsData.data)) return 0;
        
        let totalUnread = 0;
        ticketsData.data.forEach((ticket) => {
            if (!ticket.messages || !Array.isArray(ticket.messages)) return;
            
            // Filter out internal messages for users
            const userMessages = ticket.messages.filter(msg => !msg.is_internal);
            if (userMessages.length === 0) return;
            
            const lastViewed = localStorage.getItem(`user_ticket_viewed_${ticket.id}`);
            if (!lastViewed) {
                // If never viewed, count messages from admin/staff
                totalUnread += userMessages.filter(msg => !!msg.staff_id).length;
            } else {
                const lastViewedDate = new Date(lastViewed);
                // Count messages created after last view that are from admin/staff
                totalUnread += userMessages.filter(msg => {
                    const msgDate = new Date(msg.created_at);
                    return msgDate > lastViewedDate && !!msg.staff_id;
                }).length;
            }
        });
        
        return totalUnread;
    };

    const totalUnreadCount = getTotalUnreadCount();

    return (
        <>
        <div className="pr-4 sm:pr-12 py-3 fixed top-0 left-0 right-0 z-50 bg-background border-b">
            <div className="flex items-center justify-between">
                {/* Left side - Logo */}
                <div className="flex items-center gap-4 md:pl-4 lg:pl-6">
                    <Link to={ROUTES.HOME} className="flex items-center gap-2">
                        <div className="relative w-24 shrink-0">
                            <img src="https://app.privatily.com/assets/img/logo.png" alt="privatily" />
                        </div>
                    </Link>
                </div>

                {/* Right side - Get help only */}
                <div className="flex gap-4 items-center">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setHelpDialogOpen(true)}
                        className="bg-blue-700 w-24 hover:bg-accent-dark text-white text-xs px-4 border-none rounded-full cursor-pointer relative"
                    >
                        <GoQuestion className="w-6 h-6" />
                        Get help
                        {totalUnreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
        <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
        </>
    );
};

export default SuspendedNavbar;

