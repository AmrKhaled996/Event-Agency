/**
 * NAV is built as a factory that receives panel components so that this file
 * stays free of React imports (panels live in /panels/).
 *
 * Usage:
 *   import { buildNav } from "../constants/nav";
 *   const NAV = buildNav(panels);
 */

import { BadgeDollarSign, ChartColumn, LayoutDashboardIcon, TicketSlash, User } from "lucide-react";

export function buildNav(panels) {
  const {
    DashboardSummaryPanel,
    ReviewQueuePanel,
    ListUsersPanel,
    ListOrganizersPanel,
    ActiveUsersPanel,
    ListEventsPanel,
    // AnalyticsPanel,
    // FinanceSummaryPanel,
    // ProcessPayoutsPanel,
    // GetUserPanel,
    // DeleteUserPanel,
    // RestoreUserPanel,
    // GetOrganizerPanel,
    // GetEventPanel,
    // DeleteEventPanel,
    // RestoreEventPanel,
  } = panels;

  return [
    {
      id: "dashboard",
      labelKey: "nav.dashboard",
      icon: <LayoutDashboardIcon />,
      actions: [
        { id: "dashboard-summary", labelKey: "actions.dashboardSummary", method: "GET",  panel: DashboardSummaryPanel },
      ],
    },
    {
      id: "users",
      labelKey: "nav.users",
      icon: <User />,
      actions: [
        { id: "list-users",   labelKey: "actions.listUsers",   method: "GET",    panel: ListUsersPanel },
        // { id: "get-user",     labelKey: "actions.getUser",     method: "GET",    panel: GetUserPanel },
        // { id: "delete-user",  labelKey: "actions.deleteUser",  method: "DELETE", panel: DeleteUserPanel },
        // { id: "restore-user", labelKey: "actions.restoreUser", method: "PATCH",  panel: RestoreUserPanel },
      ],
    },
    {
      id: "organizers",
      labelKey: "nav.organizers",
          icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/>
        <path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/>
        <path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/>
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
      </svg>
    ),
    actions: [
      { id: "list-organizers",      labelKey: "actions.listOrganizers",      method: "GET",   panel: ListOrganizersPanel },
      // { id: "get-organizer",        labelKey: "actions.getOrganizer",        method: "GET",   panel: GetOrganizerPanel },
      { id: "review-queue",         labelKey: "actions.reviewQueue",      method: "GET",  panel: ReviewQueuePanel },
    ],
  },
  {
    id: "events",
    labelKey: "nav.events",
    icon: <TicketSlash />,
    actions: [
      { id: "list-events", labelKey: "actions.listEvents", method: "GET", panel: ListEventsPanel },
      // { id: "get-event",   labelKey: "actions.getEvent",   method: "GET", panel: GetEventPanel },
      // { id: "delete-event",   labelKey: "actions.deleteEvent",   method: "DELETE", panel: DeleteEventPanel },
      // { id: "restore-event",  labelKey: "actions.restoreEvent",  method: "PATCH",  panel: RestoreEventPanel },
    ],
  },
    // {
    //   id: "analytics",
    //   labelKey: "nav.analytics",
    //   icon: <ChartColumn />,
    //   actions: [
    //     { id: "tickets-by-event", labelKey: "actions.ticketsByEvent", method: "GET", panel: () => <AnalyticsPanel type="tickets" /> },
    //     { id: "revenue-by-event", labelKey: "actions.revenueByEvent", method: "GET", panel: () => <AnalyticsPanel type="revenue" /> },
    //     { id: "active-users",     labelKey: "actions.activeUsers",    method: "GET", panel: ActiveUsersPanel },
    //   ],
    // },
    // {
    //   id: "finance",
    //   labelKey: "nav.finance",
    //   icon: <BadgeDollarSign />,
    //   actions: [
    //     { id: "finance-summary", labelKey: "actions.financeSummary", method: "GET",  panel: FinanceSummaryPanel },
    //     { id: "process-payouts", labelKey: "actions.processPayouts", method: "POST", panel: ProcessPayoutsPanel },
    //   ],
    // },
  ];
}