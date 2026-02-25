import type { DcPost } from '@/app/lib/types';

interface DcPostCardProps {
    post: DcPost;
}

export default function DcPostCard({ post }: DcPostCardProps) {
    return (
        <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
        >
            <div className="relative overflow-hidden rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 dark:border-white/5 p-4 transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/[0.06] hover:border-blue-400/30 dark:hover:border-blue-400/20 hover:shadow-lg hover:shadow-blue-500/5 hover:scale-[1.01]">
                {/* Rank badge */}
                <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${post.rank <= 3
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/25'
                            : 'bg-white/10 dark:bg-white/5 text-gray-500 dark:text-gray-400'
                        }`}>
                        {post.rank}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Gallery tag */}
                        {post.galleryTag && (
                            <span className="inline-block px-2 py-0.5 mb-1.5 text-[10px] font-medium rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                {post.galleryTag}
                            </span>
                        )}

                        {/* Title */}
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                            {post.title}
                        </h3>

                        {/* Comment count */}
                        {post.commentCount > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                </svg>
                                <span>{post.commentCount.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
            </div>
        </a>
    );
}
