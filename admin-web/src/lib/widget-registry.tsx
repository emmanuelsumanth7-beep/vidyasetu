import React from 'react';
import dynamic from 'next/dynamic';

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide';
export type WidgetCategory = 'academics' | 'finance' | 'transport' | 'communication' | 'admin';
export type UserRole = 'principal' | 'admin' | 'teacher' | 'clerk' | 'parent';

export interface WidgetDefinition {
  id: string;
  title: string;
  size: WidgetSize;
  category: WidgetCategory;
  visibleTo: UserRole[];
  priority: number;
  isNew: boolean;
  render: React.ComponentType<any>;
}

// Dynamically import widgets to avoid bloating the main bundle
const StatsWidget = dynamic(() => import('@/components/widgets/StatsWidget'), { ssr: false, loading: () => <WidgetSkeleton /> });
const RecentFeesWidget = dynamic(() => import('@/components/widgets/RecentFeesWidget'), { ssr: false, loading: () => <WidgetSkeleton /> });
const RecentNoticesWidget = dynamic(() => import('@/components/widgets/RecentNoticesWidget'), { ssr: false, loading: () => <WidgetSkeleton /> });
const StudentProfileWidget = dynamic(() => import('@/components/widgets/StudentProfileWidget'), { ssr: false, loading: () => <WidgetSkeleton /> });
// Example placeholder for future feature
const BusTrackingWidget = dynamic(() => import('@/components/widgets/BusTrackingWidget'), { ssr: false, loading: () => <WidgetSkeleton /> });

function WidgetSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 h-full min-h-[200px]">
      <div className="h-6 w-32 bg-border-subtle rounded-md"></div>
      <div className="flex-1 w-full bg-border-subtle rounded-md"></div>
    </div>
  );
}

export const widgetRegistry: WidgetDefinition[] = [
  {
    id: "overview_stats",
    title: "Overview Statistics",
    size: "wide",
    category: "admin",
    visibleTo: ["principal", "admin", "clerk", "teacher", "parent"],
    priority: 100,
    isNew: false,
    render: StatsWidget
  },
  {
    id: "student_profile",
    title: "Student Profile",
    size: "medium",
    category: "academics",
    visibleTo: ["parent"],
    priority: 90,
    isNew: false,
    render: StudentProfileWidget
  },
  {
    id: "recent_fees",
    title: "Recent Fee Collections",
    size: "large",
    category: "finance",
    visibleTo: ["principal", "admin", "clerk"],
    priority: 80,
    isNew: false,
    render: RecentFeesWidget
  },
  {
    id: "recent_notices",
    title: "Recent Notices",
    size: "medium",
    category: "communication",
    visibleTo: ["principal", "admin", "clerk", "teacher", "parent"],
    priority: 70,
    isNew: false,
    render: RecentNoticesWidget
  },
  // Future Feature (Mock)
  {
    id: "bus_tracking",
    title: "Live Bus Tracking",
    size: "large",
    category: "transport",
    visibleTo: ["principal", "parent"],
    priority: 110, // Highly prioritized as it's new
    isNew: true,
    render: BusTrackingWidget
  }
];

export function getAllowedWidgets(role: UserRole): WidgetDefinition[] {
  return widgetRegistry
    .filter(widget => widget.visibleTo.includes(role))
    .sort((a, b) => b.priority - a.priority);
}
