import { useSyncExternalStore } from "react";
import {
  INITIAL_BOOKINGS,
  INITIAL_EMERGENCIES,
  INITIAL_NOTIFICATIONS,
  RESOURCES,
  type Booking,
  type BookingStatus,
  type EmergencyRequest,
  type Notification,
  type Resource,
} from "./data";

type State = {
  resources: Resource[];
  bookings: Booking[];
  notifications: Notification[];
  emergencies: EmergencyRequest[];
  user: {
    name: string;
    phone: string;
    email: string;
    village: string;
    role: string;
  };
  loggedIn: boolean;
};

let state: State = {
  resources: RESOURCES,
  bookings: INITIAL_BOOKINGS,
  notifications: INITIAL_NOTIFICATIONS,
  emergencies: INITIAL_EMERGENCIES,

  user: {
    name: "Suresh Kumar",
    phone: "+91 98765 00112",
    email: "suresh.kumar@village.in",
    village: "Rampur",
    role: "Farmer",
  },

  // Start the website as logged out
  loggedIn: false,
};

const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = {
    ...state,
    ...next,
  };

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

export function useStore(): State {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );
}

function notify(
  notification: Omit<Notification, "id" | "time" | "unread">
) {
  set({
    notifications: [
      {
        ...notification,
        id: `n${Date.now()}`,
        time: "Just now",
        unread: true,
      },
      ...state.notifications,
    ],
  });
}

export const actions = {
  addResource(resource: Resource) {
    set({
      resources: [resource, ...state.resources],
    });

    notify({
      type: "New Resource",
      title: "New resource added",
      body: `${resource.name} was added in ${resource.village}.`,
    });
  },

  addBooking(
    resource: Resource,
    date: string,
    time: string
  ) {
    const booking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      resourceId: resource.id,
      resourceName: resource.name,
      provider: resource.owner,
      date,
      time,
      price: resource.price,
      status: "Pending",
    };

    set({
      bookings: [booking, ...state.bookings],
    });

    notify({
      type: "Booking",
      title: "Booking request sent",
      body: `Your request for ${resource.name} on ${date} is pending confirmation.`,
    });

    return booking;
  },

  setBookingStatus(
    id: string,
    status: BookingStatus
  ) {
    set({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status,
            }
          : booking
      ),
    });

    if (status === "Cancelled") {
      notify({
        type: "Cancellation",
        title: "Booking cancelled",
        body: `Booking ${id} was cancelled.`,
      });
    }
  },

  addEmergency(
    req: Omit<EmergencyRequest, "id" | "status" | "time">
  ) {
    const emergency: EmergencyRequest = {
      ...req,
      id: `EM-${Math.floor(100 + Math.random() * 900)}`,
      status: "Open",
      time: "Just now",
    };

    set({
      emergencies: [
        emergency,
        ...state.emergencies,
      ],
    });

    notify({
      type: "Emergency",
      title: `Emergency request sent (${req.type})`,
      body: `Nearby providers in ${req.village} have been alerted.`,
    });

    return emergency;
  },

  markAllRead() {
    set({
      notifications: state.notifications.map(
        (notification) => ({
          ...notification,
          unread: false,
        })
      ),
    });
  },

  updateUser(user: Partial<State["user"]>) {
    set({
      user: {
        ...state.user,
        ...user,
      },
    });
  },

  // Login / Logout
  setLoggedIn(value: boolean) {
    set({
      loggedIn: value,
    });
  },
};