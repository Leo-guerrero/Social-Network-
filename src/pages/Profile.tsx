import { faComment, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import { faHeart as FilledHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as EmptyHeart } from "@fortawesome/free-regular-svg-icons";

function Profile() {
  const BackendURL = import.meta.env.VITE_API_URL;
  const params = useParams();
  const LeaveProfile = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === null) {
      LeaveProfile("/Login");
    }
  }, []);

  type User = {
    id: number;
    email: string;
    name: string;
    createdAt: string;
  };

  type Post = {
    id: number;
    userid: number;
    text: string;
    createdAt: string;
    likes: {
      userid: number;
    }[];
    poster: {
      name: string;
    };
    _count: {
      likes: number;
    };
  };

  type ProfileStuff = {
    userid: number;
    bio: string;
    avatarUrl?: string;
    bannerUrl?: string;
  };

  const [formData, setFormData] = useState({
    bio: "",
    avatar: null as File | null,
    banner: null as File | null,
  });

  const handleLike = async (postid: number) => {
    try {
      await fetch(`${BackendURL}/LikeUnLike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postid, userid }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("bio", formData.bio);
    if (formData.avatar) data.append("avatar", formData.avatar);
    if (formData.banner) data.append("banner", formData.banner);

    try {
      const res = await fetch(`${BackendURL}/profilesUpdate/${params.id}`, {
        method: "PUT",
        body: data,
      });

      const updated = await res.json();
      setProfileInfo(updated);
    } catch (err) {
      console.log(err);
    }
  };

  const [usersPosts, setUsersPosts] = useState<Post[]>([]);
  const [profileInfo, setProfileInfo] = useState<ProfileStuff | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userid = currentUser.id;

  if (currentUser.id != params.id) {
    const edit_profile = document.getElementById("editProfile");
    const post_profile = document.getElementById("postProfile");

    if (edit_profile) {
      edit_profile.style.display = "none";
    }

    if (post_profile) {
      post_profile.style.display = "none";
    }
  }

  useEffect(() => {
    fetch(`${BackendURL}/profiles/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfileInfo(data);
      });
  }, []);

  useEffect(() => {
    fetch(`${BackendURL}/UserSpecific/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUsersPosts(data);
      });
  }, [usersPosts]);

  useEffect(() => {
    fetch(`${BackendURL}/User/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserInfo(data);
      });
  }, []);

  // ---- FOLLOW FEATURE ----
  useEffect(() => {
    if (!params.id || !userid) return;

    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`${BackendURL}/following/${userid}`);
        const data = await res.json();
        const followingIds = data.map((u: any) => u.id);
        setIsFollowing(followingIds.includes(Number(params.id)));
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };

    const fetchFollowerCount = async () => {
      try {
        const res = await fetch(`${BackendURL}/followers/${params.id}`);
        const data = await res.json();
        setFollowersCount(data.length);
      } catch (err) {
        console.error("Error fetching follower count:", err);
      }
    };

    checkFollowStatus();
    fetchFollowerCount();
  }, [params.id, userid]);

const handleFollowToggle = async () => {
  try {
    const route = isFollowing ? "unfollow" : "follow";

    const response = await fetch(`${BackendURL}/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: Number(userid),
        followingId: Number(params.id),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    } else {
      console.error("Follow/unfollow failed:", data);
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
  }
};

  // ---- END FOLLOW FEATURE ----

  return (
    <div className="p-4 flex flex-col justify-start items-center w-screen h-screen gap-y-4 py-20 overflow-x-hidden">
      <div className="flex flex-col bg-black p-8 rounded-xl border border-gray-800 w-full md:w-1/2 gap-y-4">
        {/* Banner + Avatar */}
        <div className="relative w-full rounded-xl border border-gray-800 overflow-hidden">
          {/* Banner */}
          <div className="w-full h-40 bg-gray-800">
            {profileInfo?.bannerUrl && (
              <img
                src={profileInfo.bannerUrl}
                alt="Banner"
                className="w-full h-40 object-cover"
              />
            )}
          </div>

          {/* Avatar (absolute, overlaps banner) */}
          <div className="absolute -bottom-12 left-6">
            {profileInfo?.avatarUrl ? (
              <img
                src={profileInfo.avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-black"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-black"></div>
            )}
          </div>
        </div>

        {/* Name, join date, bio, follow button */}
        <div className="mt-16">
          <p className="text-2xl pr-20" style={{ fontFamily: "Roboot-Bold" }}>
            {userInfo?.name}
          </p>
          <p
            className="text-lg pr-20 text-gray-500"
            style={{ fontFamily: "Roboot-Medium" }}
          >
            <FontAwesomeIcon icon={faCalendarDays} /> Joined{" "}
            {format(
              new Date(userInfo?.createdAt ?? Date.now()),
              "MMM dd, yyyy"
            )}
          </p>
          <p className="text-lg" style={{ fontFamily: "Roboot-Medium" }}>
            {profileInfo?.bio}
          </p>

          {/* FOLLOW BUTTON */}
          {userid !== Number(params.id) && (
            <button
              onClick={handleFollowToggle}
              className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors
                ${
                  isFollowing
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-purple-500 hover:bg-purple-400"
                }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          <p className="text-gray-400 text-md mt-2">
            {followersCount}{" "}
            {followersCount === 1 ? "Follower" : "Followers"}
          </p>

          <Popup
            trigger={
              <button
                id="editProfile"
                style={{ fontFamily: "Roboot-Medium" }}
                className="button text-sm border border-gray-800 py-2 rounded-lg w-32 sm:w-64 hover:bg-purple-500 mt-4"
              >
                <FontAwesomeIcon icon={faPenToSquare} /> Edit Profile
              </button>
            }
            modal
          >
            <div className="bg-black p-12 border border-gray-600 rounded-xl w-full px-10 flex flex-col gap-y-4">
              <p className="text-xl font-bold">Edit Profile</p>
              <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
                <label htmlFor="bio" className="sr-only">
                  Add/Edit a Bio
                </label>
                <textarea
                  className="w-full sm:w-96 h-40 border border-gray-700 p-4 rounded-xl resize-none"
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  onChange={handleChange}
                />

                <label className="text-gray-300">Profile Picture</label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-gray-400"
                />
                {formData.avatar && (
                  <img
                    src={URL.createObjectURL(formData.avatar)}
                    alt="Preview"
                    className="w-24 h-24 rounded-full mt-2"
                  />
                )}

                <label className="text-gray-300">Banner</label>
                <input
                  type="file"
                  name="banner"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-gray-400"
                />
                {formData.banner && (
                  <img
                    src={URL.createObjectURL(formData.banner)}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl mt-2"
                  />
                )}

                <button
                  style={{ fontFamily: "Roboot-Medium" }}
                  className="p-2 bg-purple-500 rounded-xl hover:bg-purple-400"
                  type="submit"
                >
                  Save
                </button>
              </form>
            </div>
          </Popup>
        </div>
      </div>

      {/* POSTS SECTION */}
      <div className="flex flex-col gap-y-2 border border-gray-800 rounded-xl px-12 w-full md:w-1/2 py-6">
        <p className="text-2xl">Posts</p>

        {usersPosts.slice().map((post) => (
          <Link to={`/postPage/${post.id}`} key={post.id}>
            <div className="flex flex-row border border-gray-800 px-6 pt-5 pb-1 rounded-lg text-sm md:text-lg w-[220px] sm:w-[470px] lg:w-[650px] gap-x-2">
              <div className="bg-gray-800 p-4 sm:p-5 h-8 w-8 rounded-full"></div>
              <div
                className="flex flex-col gap-y-2"
                style={{ fontFamily: "Roboot-Bold" }}
              >
                <p>
                  {post.poster.name}{" "}
                  <span
                    style={{ fontFamily: "Roboot-Medium" }}
                    className="text-gray-500 text-md"
                  >
                    {format(new Date(post.createdAt), "MMM dd")}
                  </span>
                </p>
                <p style={{ fontFamily: "Roboot-Medium" }}>{post.text}</p>
                <div className="flex flex-row items-center hover:text-pink-400">
                  <button className="hover:bg-purple-500/50 h-8 w-8 rounded-full text-gray-700 hover:text-purple-400">
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                  <p className="text-gray-700 text-sm hover:text-purple-400">0</p>
                  <button
                    className={`hover:bg-rose-500/50 h-8 w-8 rounded-full ${
                      post.likes.some((like) => like.userid == userid)
                        ? "text-red-400 hover:bg-rose-500/50"
                        : "text-gray-700 hover:text-pink-400"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(post.id);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        post.likes.some((like) => like.userid === userid)
                          ? FilledHeart
                          : EmptyHeart
                      }
                    />
                  </button>
                  <p className="text-gray-700 text-sm hover:text-pink-400">
                    {post._count.likes}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Profile;
