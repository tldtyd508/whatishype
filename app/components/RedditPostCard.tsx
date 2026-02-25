import type { RedditPost } from '@/app/lib/types';

interface RedditPostCardProps {
    post: RedditPost;
}

function formatScore(score: number): string {
    if (score >= 100000) return `${(score / 1000).toFixed(0)}k`;
    if (score >= 10000) return `${(score / 1000).toFixed(1)}k`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
    return score.toLocaleString();
}

export default function RedditPostCard({ post }: RedditPostCardProps) {
    return (
        <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
        >
            <div className="relative overflow-hidden rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 dark:border-white/5 p-4 transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/[0.06] hover:border-orange-400/30 dark:hover:border-orange-400/20 hover:shadow-lg hover:shadow-orange-500/5 hover:scale-[1.01]">
                <div className="flex items-start gap-3">
                    {/* Rank badge */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${post.rank <= 3
                            ? 'bg-gradient-to-br from-orange-500 to-red-400 text-white shadow-md shadow-orange-500/25'
                            : 'bg-white/10 dark:bg-white/5 text-gray-500 dark:text-gray-400'
                        }`}>
                        {post.rank}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Subreddit tag */}
                        <span className="inline-block px-2 py-0.5 mb-1.5 text-[10px] font-medium rounded-md bg-orange-500/15 text-orange-400 border border-orange-500/20">
                            r/{post.subreddit}
                        </span>

                        {/* Title */}
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug group-hover:text-orange-400 transition-colors duration-200 line-clamp-2">
                            {post.title}
                        </h3>

                        {/* Stats */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            {/* Upvotes */}
                            <div className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>
                                <span>{formatScore(post.score)}</span>
                            </div>

                            {/* Comments */}
                            <div className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                </svg>
                                <span>{formatScore(post.numComments)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl bg-gradient-to-r from-orange-500/5 to-red-500/5" />
            </div>
        </a>
    );
}
