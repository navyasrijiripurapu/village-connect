import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Bell, CalendarCheck, PackagePlus, RefreshCw, XCircle } from "lucide-react";
import { PageLayout, PageHeader } from "@/components/PageLayout";
import { actions, useStore } from "@/lib/store";
import type { Notification } from "@/lib/data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | Village Resource Network" },
      { name: "description", content: "Booking confirmations, cancellations, availability updates, emergency alerts and new resource notices." },
      { property: "og:title", content: "Notifications" },
      { property: "og:description", content: "Stay updated on bookings, availability and village emergency alerts." },
    ],
  }),
  component: NotificationsPage,
});

const ICONS: Record<Notification["type"], typeof Bell> = {
  Booking: CalendarCheck,
  Cancellation: XCircle,
  Availability: RefreshCw,
  Emergency: AlertTriangle,
  "New Resource": PackagePlus,
};

function NotificationsPage() {
  const { notifications } = useStore();
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <PageLayout>
      <PageHeader title="Notifications" subtitle={`${unread} unread update${unread === 1 ? "" : "s"} from your village network.`} />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex justify-end">
          <button onClick={actions.markAllRead} className="rounded-lg border-2 border-primary px-4 py-2.5 text-sm font-bold text-primary hover:bg-accent">
            Mark all as read
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            const danger = n.type === "Emergency";
            return (
              <article
                key={n.id}
                className={`flex gap-4 rounded-xl border-2 bg-card p-5 ${
                  n.unread ? "border-l-8 border-border border-l-primary" : "border-border"
                }`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${danger ? "bg-destructive/15" : "bg-accent"}`}>
                  <Icon className={`h-5 w-5 ${danger ? "text-destructive" : "text-primary"}`} />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-foreground">{n.title}</h3>
                    <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">{n.type}</span>
                    {n.unread && <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">New</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
