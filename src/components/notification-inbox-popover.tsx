"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell as BellIcon, 
  Calendar, 
  MessageSquare, 
  Info, 
  CheckCircle2 
} from "lucide-react";
import { useNotifications } from "@/hooks/use-notification";
import { Notification } from "@/core/domain/models/notification";


const getNotificationIcon = (notification: Notification) => {
  const type = notification.type?.toLowerCase();

  if (type === "appointment" || notification.appointmentId) return Calendar;
  if (type === "review" || notification.reviewId) return MessageSquare;
  if (type === "success") return CheckCircle2;
  
  return Info;
};

function NotificationInboxPopover() {
  
  const { data: response } = useNotifications();
  
 const notifications = Array.isArray(response)
    ? response
    : ((response as any)?.data ?? []) as Notification[];

  const [tab, setTab] = useState("all");

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (tab === "unread") {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [tab, notifications]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="relative" aria-label="Notificações">
          <BellIcon size={16} strokeWidth={2} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1 h-5 flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[380px] p-0" align="end">
        <Tabs value={tab} onValueChange={setTab}>
          {/* Cabeçalho */}
          <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/10">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="all" 
                className="text-xs px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Todas
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="text-xs px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Não lidas 
                {unreadCount > 0 && (
                  <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Lista */}
          <div className="max-h-[400px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <BellIcon className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">Nenhuma notificação encontrada</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredNotifications.map((n) => {
                  const Icon = getNotificationIcon(n);
                  const serviceName = n.service?.name || n.appointment?.service?.name;

                  return (
                    <div
                      key={n.id}
                      className={`
                        flex items-start gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50
                        ${!n.read ? "bg-muted/20" : "bg-background"}
                      `}
                    >
                      {/* Ícone */}
                      <div className={`mt-1 rounded-full p-1.5 ${!n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <Icon size={14} />
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm truncate pr-2 ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {n.message}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] text-muted-foreground/60">
                            {formatDate(n.createdAt)}
                          </span>
                          {serviceName && (
                            <>
                              <span className="text-[10px] text-muted-foreground/30">•</span>
                              <span className="text-[10px] font-medium text-muted-foreground/80 truncate max-w-[120px]">
                                {serviceName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

export { NotificationInboxPopover };