// src/pages/ExplorePage.tsx
import React, { useEffect, useState} from "react";
import type { FormEvent } from "react";
import Sidebar from '../components/Sidebar'

type trendingPost = {
  id: number;
  parentId: null;
  userid: number;
  text: string;
  createdAt: string;
  imageURL: string;
  likes: {
    userid: number;
  }[];
  poster: {
    id: number;
    name: string;
    profileURL: string;
  };
  _count: {
    likes: number;
  }
}

type SearchPost = {
  id: number;
  userid: number;
  text: string | null;
  createdAt: string;
  imageURL: string;
  likedByUser: boolean;
  parentId: number | null;
  poster: {
    id: number;
    name: string | null;
    profileURL?: string | null;
  };
  _count: {
    likes: number;
    replies: number;
  };
  score: number; // elasticlunr relevance score
};

const ExplorePage: React.FC = () => {
  const BackendURL = import.meta.env.VITE_API_URL;

  const [trendingPosts, setTrendingPosts] = useState<trendingPost[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchPost[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);


  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoadingTrending(true);
        setTrendingError(null);

        const res = await fetch(`${BackendURL}/api/trending`); // Have to change this when pushing
        if (!res.ok) {
          throw new Error("Failed to fetch trending posts");
        }

        const data = await res.json();
        setTrendingPosts(data);
      } catch (err: any) {
        console.error("Error fetching trending posts:", err);
        setTrendingError(err.message || "Error loading trending posts");
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrending();
  }, []);


  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    try {
      setLoadingSearch(true);
      setSearchError(null);

      const res = await fetch(
        `${BackendURL}/api/search?q=${encodeURIComponent(trimmed)}`
      );
      if (!res.ok) {
        throw new Error("Failed to search posts");
      }

      const data = await res.json();
      setSearchResults((data.results ?? []) as SearchPost[]);
    } catch (err: any) {
      console.error("Error searching posts:", err);
      setSearchError(err.message || "Error searching posts");
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Roboot-Medium' }} className="min-h-screen w-screen">
      <div className="h-full w-full grid gap-4 [grid-template-columns:19%_40%_39%]">
        {/* Left Column (19%) Allocated Space for Sidebar */}
        <section className="p-4">
          <Sidebar></Sidebar>
        </section>
        {/* Middle Column (40%) Searchbar and Posts */}
        <section className="p-4 border-r border-zinc-700">
          {/* === Search Bar === */}
          <div className="w-full">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search posts..."
                className="
                  w-full
                  rounded-xl
                  bg-zinc-800
                  text-zinc-200
                  px-4 py-3
                  focus:outline-none
                  focus:ring-2 focus:ring-purple-500
                  placeholder:text-zinc-500
                  shadow-sm
                "
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>
          {/* === Search Results === */}
          {loadingSearch && (
            <p className="text-sm text-zinc-400">Searching...</p>
          )}

          {searchError && (
            <p className="text-sm text-red-400 mb-2">{searchError}</p>
          )}

          {!loadingSearch && !searchError && query.trim() && searchResults.length === 0 && (
            <p className="text-sm text-zinc-400">
              No results found for “{query}”.
            </p>
          )}

          <ul className="space-y-3">
            {searchResults.map((post) => (
              <li
                key={post.id}
                className="
                  rounded-xl
                  px-3 py-2
                  hover:bg-zinc-700/80
                  transition
                  flex items-start gap-3
                  border border-gray-700
                "
              >
                <div className="flex-1">
                  {/* Poster name */}
                  <div className="text-xs text-zinc-400 mb-1">
                    {post.poster?.name || "Unknown user"}
                  </div>

                  {/* Post text */}
                  <div className="text-sm text-zinc-100 mb-1">
                    {post.text}
                  </div>

                  {/* Post image (if any) */}
                  {post.imageURL && post.imageURL !== "" && (
                    <div className="mt-1">
                      <img
                        className="rounded-lg max-h-100"
                        src={post.imageURL}
                        alt="Post"
                      />
                    </div>
                  )}

                  {/* Likes / replies / score */}
                  <div className="mt-1 text-xs text-zinc-500 flex gap-2">
                    <span>
                      {(post._count?.likes ?? 0) === 1
                        ? "1 like"
                        : `${post._count?.likes ?? 0} likes`}
                    </span>
                    <span>· {post._count?.replies ?? 0} replies</span>
                    {/* Optional: debug relevance */}
                    {/* <span>· score: {post.score.toFixed(3)}</span> */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {/* Right Column (40%) Trending and Suggested Friends*/}
        <section className="grid grid-rows-2 gap-4 text-white">
          {/* Top Row: Trending */}
          <div className="pb-4 border-b border-gray-700">
            <h2 className="text-xl font-bold mb-2 mt-6">Trending</h2>
            {/* Trending Content */}
            {loadingTrending && (
              <p className="text-sm text-zinc-400">Loading trending posts...</p>
            )}

            {trendingError && (
              <p className="text-sm text-red-400">{trendingError}</p>
            )}

            {!loadingTrending &&
              !trendingError &&
              trendingPosts.length === 0 && (
                <p className="text-sm text-zinc-400">
                  No trending posts yet. Be the first to post something awesome!
                </p>
              )}

            <ul className="space-y-3">
              {trendingPosts.map((post, index) => (
                <li
                  key={post.id}
                  className="
                    rounded-xl
                    px-3 py-2
                    mr-4
                    hover:bg-zinc-700/80
                    transition
                    flex items-start gap-3
                    border border-gray-700
                  "
                >
                  {/* Rank */}
                  <span className="mt-1 text-sm font-semibold text-purple-500">
                    #{index + 1}
                  </span>

                  <div className="flex-1">
                    {/* Poster name */}
                    <div className="text-xs text-zinc-400 mb-1">
                      {post.poster?.name ||
                        "Unknown user"}
                    </div>

                    {/* Post text */}
                    <div className="text-sm text-zinc-100 line-clamp-2">
                      {post.text}
                    </div>

                    {/* Post image */}
                    <div className="">
                      <img className="rounded-lg max-h-100" src={post.imageURL} />
                    </div>

                    {/* Like count */}
                    <div className="mt-1 text-xs text-zinc-500">
                      {(post._count?.likes ?? 0) === 1
                        ? "1 like"
                        : `${post._count?.likes ?? 0} likes`}
                    </div>
                  </div>
                  
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Row: Suggested Friends */}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Suggested Friends</h2>
            {/* Suggested friends content here */}
          </div>
          
          
        </section>





      </div>
    </div>
  );
};

export default ExplorePage;
