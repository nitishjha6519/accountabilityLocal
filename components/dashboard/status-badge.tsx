interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    "on-track": {
      bg: "bg-success/20",
      text: "text-success",
      label: "ON TRACK",
    },
    "needs-action": {
      bg: "bg-warning/20",
      text: "text-warning",
      label: "NEEDS ACTION",
    },
    paused: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      label: "PAUSED",
    },
    done: {
      bg: "bg-success/20",
      text: "text-success",
      label: "Done",
    },
    "starting-soon": {
      bg: "bg-warning/20",
      text: "text-warning",
      label: "Starting Soon",
    },
    completed: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      label: "Completed",
    },
    "check-in-needed": {
      bg: "bg-warning/20",
      text: "text-warning",
      label: "Check-in Needed",
    },
    pending: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      label: "Pending",
    },
    accepted: {
      bg: "bg-success/20",
      text: "text-success",
      label: "Accepted",
    },
    rejected: {
      bg: "bg-destructive/20",
      text: "text-destructive",
      label: "Rejected",
    },
  };

  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span
      className={`rounded-full ${style.bg} px-3 py-1 text-xs font-medium ${style.text}`}
    >
      {style.label}
    </span>
  );
}
