import { faComment } from "@fortawesome/free-regular-svg-icons";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { faArrowLeft, faHeart as FilledHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as EmptyHeart } from "@fortawesome/free-regular-svg-icons";

function postPage() {

    const BackendURL = import.meta.env.VITE_API_URL;
    const params = useParams();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userid = currentUser.id

    type Post = {
        id: number;
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
        };
        _count: {
            likes: number;
        }

        //I need to fix this later at this only has 1 layer deep replies.
        replies: {
            id: number;
            parentId: number;
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
            };
            _count: {
                likes: number;
            }
        }[];
    }

    const [daPost, setDaPost] = useState<Post>();

    //this is what fetches the replies... also why daPost...
    const [replies, setReplies] = useState<Post['replies']>([]);

    //logic for posting a reply:
    //
    const [replyFormData, setReplyFormData] = useState({ text: "" });

    const handleChangeReply = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReplyFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmitReply = async (e: React.FormEvent, parentId: number | undefined) => {
        e.preventDefault();

        if (!replyFormData.text || !parentId) return;

        try {
            const response = await fetch(`${BackendURL}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: replyFormData.text,
                    parentId,   // use what was passed in
                    userid: currentUser.id,
                }),
            });

            const newReply = await response.json();

            // add reply to state with poster + likes already populated
            setDaPost(prev =>
                prev ? { ...prev, replies: [...prev.replies, newReply] } : prev
            );

            setReplyFormData({ text: "" });

        } catch (err) {
            console.error(err);
        }
    };



    //



    useEffect(() => {
        fetch(`${BackendURL}/Get/Specific/Post/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setDaPost(data);
                //added this for replies

                console.log(replies);
                setReplies(data.replies);
            })
        //added this to maintain state when switching between replies.
    }, [params.id]);

    const handleLike = async (postid: any) => {
        try {
            await fetch(`${BackendURL}/LikeUnLike`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postid, userid })
            });

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <div className="flex justify-center w-screen p-4">


                <div className="flex flex-col border border-gray-800 justify-center px-6 pt-5 pb-2 rounded-lg text-sm md:text-lg gap-y-6 w-full sm:w-3/4 lg:w-1/2">

                    <div style={{ fontFamily: 'Roboot-bold' }} className="flex flex-row items-center space-x-6 text-2xl">
                        <Link to="/MainFeed"><FontAwesomeIcon icon={faArrowLeft} /></Link>
                        <p className="text-2xl" style={{ fontFamily: 'Roboot-bold' }}>Post</p>
                    </div>

                    <div className="flex flex-row gap-x-2">

                        <Link to={`/Profile/${daPost?.poster.id}`}><div className="bg-gray-800 p-4 sm:p-5 h-12 w-12 rounded-full"></div></Link>
                        <div className="flex flex-col gap-y-2">
                            <Link to={`/Profile/${daPost?.poster.id}`}><p><span className="hover:underline text-xl" style={{ fontFamily: 'Roboot-bold' }}>{daPost?.poster.name}</span></p></Link>
                            <p style={{ fontFamily: 'Roboot-Medium' }}>{daPost?.text}</p>
                            {daPost?.imageURL.includes("mp4") ? ( 
                                <video className="rounded-lg" src={daPost?.imageURL} autoPlay muted controls />
                                ) : (
                                <img className="rounded-lg" src={daPost?.imageURL} />
                            )}
                            <p><span style={{ fontFamily: 'Roboot-Medium' }} className="text-gray-500 text-md">{daPost?.createdAt ? format(new Date(daPost.createdAt), 'MMM dd, yyyy • h:mm a') : "Loading..."}</span></p>
                        </div>

                    </div>
                    <div className="flex flex-row items-center hover:text-pink-400 space-x-6">

                        <div className="flex flex-row items-center">
                            {/* <button className="hover:bg-purple-500/50 h-8 w-8 rounded-full text-gray-700 hover:text-purple-400 text-xl"><FontAwesomeIcon icon={faComment} /></button>
                    <p className="text-gray-700 text-xl hover:text-purple-400">0</p> */}

                            <div className="flex flex-row items-center">
                                <Popup
                                    trigger={
                                        <button className="hover:bg-purple-500/50 h-8 w-8 rounded-full text-gray-700 hover:text-purple-400 text-xl">
                                            <FontAwesomeIcon icon={faComment} />
                                        </button>
                                    }
                                    modal
                                >
                                    <div className="bg-black p-8 border border-gray-600 rounded-xl w-full px-10 flex flex-col gap-y-4">
                                        <form className="flex flex-col gap-y-4" onSubmit={(e) => handleSubmitReply(e, daPost?.id)}>
                                            <label htmlFor="replyText" className="sr-only">Write a Reply</label>
                                            <textarea
                                                className="w-full sm:w-120 h-40 border-none p-4 rounded-xl resize-none focus:outline-none focus:ring-0"
                                                id="replyText"
                                                name="text"
                                                placeholder="Write a reply..."
                                                onChange={handleChangeReply}
                                                value={replyFormData.text}
                                            />
                                            <button
                                                className="p-2 bg-purple-500 rounded-xl hover:bg-purple-400"
                                                type="submit"
                                            >
                                                Reply
                                            </button>
                                        </form>
                                    </div>
                                </Popup>


                                <p className="text-gray-700 text-xl hover:text-purple-400 ml-2">{(daPost?.replies || []).length}</p>
                            </div>


                        </div>

                        <div className="flex flex-row items-center">
                            <button className={`hover:bg-rose-500/50 h-8 w-8 rounded-full text-xl ${daPost?.likes.some(like => like.userid === userid) ? "text-red-400 hover:bg-rose-500/50" : "text-gray-700 hover:text-pink-400"}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike(daPost?.id); }}><FontAwesomeIcon icon={daPost?.likes.some((like) => like.userid == userid) ? FilledHeart : EmptyHeart} /></button>
                            <p className="text-gray-700 text-xl hover:text-pink-400">{daPost?._count.likes}</p>
                        </div>
                    </div>

                </div>



            </div>

            {daPost ? (
                <div className="flex justify-center w-screen p-4">
                    <div className="border border-gray-800 w-full sm:w-3/4 lg:w-1/2 rounded-lg px-6 py-4">
                        <p style={{ fontFamily: 'Roboot-bold' }} className="text-2xl">Replies</p>

                        {(daPost.replies?.length || 0) === 0 ? (
                            <p className="text-gray-500">No replies yet</p>
                        ) : (
                            daPost.replies.map((reply) => (
                                <div key={reply.id} className="flex flex-row gap-x-2 mt-2 border-t border-gray-700 pt-2">
                                    <Link to={`/Profile/${reply.poster.id}`}>
                                        <div className="bg-gray-800 p-4 sm:p-5 h-10 w-10 rounded-full"></div>
                                    </Link>
                                    <div className="flex flex-col gap-y-1">
                                        <Link to={`/Profile/${reply.poster.id}`}>
                                            <p><span className="hover:underline">{reply.poster.name}</span></p>
                                        </Link>
                                        <p>{reply.text}</p>
                                        <p className="text-gray-500 text-sm">
                                            {format(new Date(reply.createdAt), 'MMM dd, yyyy • h:mm a')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading post...</p>
            )}


        </>
    )
}

export default postPage;