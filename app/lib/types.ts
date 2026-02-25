export interface DcPost {
    rank: number;
    title: string;
    galleryTag: string;
    commentCount: number;
    link: string;
}

export interface RedditPost {
    rank: number;
    title: string;
    subreddit: string;
    score: number;
    numComments: number;
    permalink: string;
    thumbnail?: string;
}

export interface GoogleNewsPost {
    rank: number;
    title: string;
    url: string;
    source: string;
    time: string;
}

export interface MelonSong {
    rank: number;
    title: string;
    artist: string;
}

export interface GoogleTrend {
    rank: number;
    keyword: string;
    traffic: string;
    newsTitle?: string;
    newsUrl?: string;
    newsImage?: string;
    newsSource?: string;
}

export interface NamuKeyword {
    rank: number;
    keyword: string;
}

export interface XTrend {
    rank: number;
    keyword: string;
    tweetCount?: string;
}

export interface FeedResponse<T> {
    posts: T[];
    updatedAt: string;
    blocked?: boolean;
    reason?: string;
}
