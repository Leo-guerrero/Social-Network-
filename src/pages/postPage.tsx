import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { faArrowLeft, faHeart as FilledHeart} from "@fortawesome/free-solid-svg-icons";
import { faHeart as EmptyHeart } from "@fortawesome/free-regular-svg-icons";

function postPage(){

    const BackendURL = import.meta.env.VITE_API_URL;
    const params = useParams();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userid = currentUser.id

    type Post = {
        id: number;
        userid: number;
        text: string;
        createdAt: string;
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
    }

    const [daPost, setDaPost] = useState<Post>();

    useEffect(() => {
        fetch(`${BackendURL}/Get/Specific/Post/${params.id}`)
        .then(res => res.json())
        .then(data => {
            setDaPost(data);
        })
    });

    const handleLike = async(postid: any) =>{
        try{
            await fetch(`${BackendURL}/LikeUnLike`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postid, userid })
            });

        } catch(error){
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
                    <p><span style={{ fontFamily: 'Roboot-Medium' }} className="text-gray-500 text-md">{daPost?.createdAt ? format(new Date(daPost.createdAt), 'MMM dd, yyyy • h:mm a') : "Loading..."}</span></p>
                </div>

            </div>
            <div className="flex flex-row items-center hover:text-pink-400 space-x-6">

                <div className="flex flex-row items-center">
                    <button className="hover:bg-purple-500/50 h-8 w-8 rounded-full text-gray-700 hover:text-purple-400 text-xl"><FontAwesomeIcon icon={faComment} /></button>
                    <p className="text-gray-700 text-xl hover:text-purple-400">0</p>
                </div>

                <div className="flex flex-row items-center">
                    <button className={`hover:bg-rose-500/50 h-8 w-8 rounded-full text-xl ${daPost?.likes.some(like => like.userid === userid) ? "text-red-400 hover:bg-rose-500/50": "text-gray-700 hover:text-pink-400" }`} onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleLike(daPost?.id);}}><FontAwesomeIcon icon={daPost?.likes.some((like) => like.userid == userid) ? FilledHeart: EmptyHeart} /></button>
                    <p className="text-gray-700 text-xl hover:text-pink-400">{daPost?._count.likes}</p>
                </div>
            </div>

        </div>
        
        

        </div>

        <div className="flex justify-center w-screen p-4">
            <div className="border border-gray-800 w-full sm:w-3/4 lg:w-1/2 rounded-lg px-6 py-4"><p style={{ fontFamily: 'Roboot-bold' }} className="text-2xl">Replies</p></div>
        </div>
        </>
    )
}

export default postPage;