import React from 'react';

interface FeedColumnProps {
    title: string;
    icon: React.ReactNode;
    accentColor: 'blue' | 'orange';
    count: number;
    isLoading: boolean;
    error: string | null;
    children: React.ReactNode;
}

export default function FeedColumn({
    title,
    icon,
    accentColor,
    count,
    isLoading,
    error,
    children,
}: FeedColumnProps) {
    const gradientClass =
        accentColor === 'blue'
            ? 'from-blue-500 to-cyan-400'
            : 'from-orange-500 to-red-400';

    const countBgClass =
        accentColor === 'blue'
            ? 'bg-blue-500/15 text-blue-400'
            : 'bg-orange-500/15 text-orange-400';

    return (
        <div className="flex flex-col h-full">
            {/* Column header */}
            <div className="flex items-center gap-3 mb-4 px-1">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}>
                    {icon}
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {title}
                </h2>
                {count > 0 && (
                    <span className={`px-2 py-0.5 ml-auto text-xs font-medium rounded-full ${countBgClass}`}>
                        {count}
                    </span>
                )}
            </div>

            {/* Content area */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {isLoading && !error && (
                    <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 dark:border-white/5 p-4 animate-pulse"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white/10 dark:bg-white/5" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-16 rounded bg-white/10 dark:bg-white/5" />
                                        <div className="h-4 w-full rounded bg-white/10 dark:bg-white/5" />
                                        <div className="h-4 w-3/4 rounded bg-white/10 dark:bg-white/5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6 text-center">
                        <div className="text-red-400 text-sm font-medium mb-1">데이터를 불러올 수 없습니다</div>
                        <div className="text-red-400/60 text-xs">{error}</div>
                    </div>
                )}

                {!isLoading && !error && count === 0 && (
                    <div className="rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 dark:border-white/5 p-8 text-center">
                        <div className="text-gray-400 dark:text-gray-500 text-sm">게시글이 없습니다</div>
                    </div>
                )}

                {!isLoading && !error && children}
            </div>
        </div>
    );
}
