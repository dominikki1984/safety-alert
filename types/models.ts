export type AppSettings = {
  emergencyNumber: string;
  sosMessage: string;
  includeLocation: boolean;
};

export type RecentActionType = "SMS" | "CALL" | "PHOTO";

export type RecentAction = {
  id: string;
  type: RecentActionType;
  timestamp: number;
  title: string;
  detail?: string;
};
