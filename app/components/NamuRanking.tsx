import type { NamuKeyword } from '@/app/lib/types';

interface NamuRankingProps {
    keywords: NamuKeyword[];
    isLoading: boolean;
    error: string | null;
}

export default function NamuRanking({ keywords, isLoading, error }: NamuRankingProps) {
    return (
        <div className="rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/20 dark:border-white/[0.06] overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10 dark:border-white/5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/25">
                    <span className="text-white text-xs font-bold">📚</span>
                </div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">나무위키 실검</h2>
                <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-600">~30분 갱신</span>
            </div>

            {/* Content */}
            <div className="p-2">
                {isLoading && (
                    <div className="space-y-1.5 p-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 px-2 animate-pulse">
                                <div className="w-5 h-5 rounded bg-white/10 dark:bg-white/5" />
                                <div className="h-3.5 flex-1 rounded bg-white/10 dark:bg-white/5" />
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="p-4 text-center text-xs text-red-400">
                        불러올 수 없습니다
                    </div>
                )}

                {!isLoading && !error && keywords.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400">
                        데이터 없음
                    </div>
                )}

                {!isLoading && !error && keywords.length > 0 && (
                    <ol className="space-y-0.5">
                        {keywords.map((kw) => (
                            <li key={kw.rank}>
                                <a
                                    href={`https://namu.wiki/w/${encodeURIComponent(kw.keyword)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/40 dark:hover:bg-white/[0.04] transition-colors group"
                                >
                                    <span className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${kw.rank <= 3
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-400 text-white'
                                            : 'bg-white/10 dark:bg-white/5 text-gray-500 dark:text-gray-500'
                                        }`}>
                                        {kw.rank}
                                    </span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                                        {kw.keyword}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
}
