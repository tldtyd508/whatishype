import type { GoogleTrend } from '@/app/lib/types';

interface TrendCardProps {
    trend: GoogleTrend;
    size?: 'large' | 'medium' | 'small';
}

function parseTraffic(traffic: string): number {
    const num = parseInt(traffic.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
}

function getTrafficLabel(traffic: string): string {
    const num = parseTraffic(traffic);
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return `${num}+`;
}

export default function TrendCard({ trend, size = 'small' }: TrendCardProps) {
    const trafficNum = parseTraffic(trend.traffic);

    const sizeClasses = {
        large: 'col-span-2 row-span-2',
        medium: 'col-span-2 sm:col-span-1',
        small: '',
    };

    const hasNews = trend.newsTitle && trend.newsUrl;

    return (
        <div className={`group ${sizeClasses[size]}`}>
            <div className="relative h-full overflow-hidden rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/20 dark:border-white/[0.06] p-4 sm:p-5 transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/[0.07] hover:border-violet-400/30 dark:hover:border-violet-400/20 hover:shadow-xl hover:shadow-violet-500/5 hover:scale-[1.01] backdrop-blur-sm">
                {/* Rank + Traffic */}
                <div className="flex items-center justify-between mb-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${trend.rank <= 3
                            ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md shadow-violet-500/25'
                            : trend.rank <= 6
                                ? 'bg-gradient-to-br from-indigo-500/80 to-violet-500/80 text-white shadow-sm'
                                : 'bg-white/20 dark:bg-white/5 text-gray-500 dark:text-gray-400'
                        }`}>
                        {trend.rank}
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${trafficNum >= 1000
                            ? 'bg-red-500/15 text-red-500 dark:text-red-400'
                            : trafficNum >= 500
                                ? 'bg-orange-500/15 text-orange-500 dark:text-orange-400'
                                : 'bg-gray-500/10 text-gray-500 dark:text-gray-400'
                        }`}>
                        🔍 {getTrafficLabel(trend.traffic)}
                    </span>
                </div>

                {/* Keyword */}
                <h3 className={`font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors ${size === 'large' ? 'text-xl sm:text-2xl' : size === 'medium' ? 'text-lg' : 'text-base'
                    }`}>
                    {trend.keyword}
                </h3>

                {/* Related news */}
                {hasNews && (
                    <a
                        href={trend.newsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-3"
                    >
                        <div className="flex items-start gap-2.5">
                            {trend.newsImage && (
                                <div className="flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                                    <img
                                        src={trend.newsImage}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug line-clamp-2 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
                                    {trend.newsTitle}
                                </p>
                                {trend.newsSource && (
                                    <span className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5 block">
                                        {trend.newsSource}
                                    </span>
                                )}
                            </div>
                        </div>
                    </a>
                )}

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl bg-gradient-to-br from-violet-500/5 to-pink-500/5" />
            </div>
        </div>
    );
}
