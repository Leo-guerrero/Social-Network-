import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faComment, faUser } from "@fortawesome/free-regular-svg-icons";
import { faCode, faHeart as FilledHeart} from "@fortawesome/free-solid-svg-icons";
import { faHeart as EmptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHouse, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import Popup from "reactjs-popup";
import { useEffect, useState } from "react";
import { format } from 'date-fns';


function MainFeed(){
    const BackendURL = import.meta.env.VITE_API_URL;
   

    const handleLike = async(postid: number) =>{
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

    function reloadPage(){
        window.location.reload();
    }

    type Post = {
        id: number;
        parentId: null;
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

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const userid = currentUser.id

    const [formData, setFormData] = useState({
        text: ""
    });

    const [posts, setPosts] = useState<Post[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        
        setFormData(prev => ({...prev, [e.target.name]: e.target.value,
            })
        );
        console.log(formData.text);
    }

    const handleSubmit = async(e: React.FormEvent ) =>{
        e.preventDefault();

        try {
            const response = await fetch(`${BackendURL}/CreatePost/${currentUser.id}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });
            if (response.ok){

            }

        } catch(error){
            console.log(error);
        }
        
    }


    useEffect(() => {
        fetch(`${BackendURL}/GetAllPosts`)
        .then(res => res.json())
        .then(data => {
            setPosts(data)
        })

    }, [posts]);
    console.log("Post tuah:", posts);

    // const topLevelPosts = posts.filter(post => !post.parentId);
   
    
    return (
        <div className="flex flex-row justify-center gap-x-4 md:gap-x-12 p-2 overflow-x-hidden py-20 pl-15 md:pl-40 xl:pl-50">

            <div className="flex flex-col p-2 gap-y-2 text-2xl md:text-xl whitespace-nowrap shrink-0 overflow-x-hidden fixed left-0 py-4 md:pl-10 xl:pl-30">
                <Link to={`/Profile/${currentUser.id}`}><button className="flex items-center gap-x-4 rounded-xl px-2 py-2 hover:bg-purple-500" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faUser} /><span className="hidden md:block">Profile</span></button></Link>
                <button onClick={reloadPage} className="flex items-center gap-x-4 rounded-xl px-2 py-2 hover:bg-purple-500" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faHouse} /><span className="hidden md:block">Home</span></button>
                <button className="flex items-center gap-x-4 rounded-xl px-2 py-2 hover:bg-purple-500" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faMagnifyingGlass} /><span className="hidden md:block">Search</span></button>
                <Link to="/Program"><button className="flex items-center gap-x-4 rounded-xl px-2 py-2 hover:bg-purple-500" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faCode} /><span className="hidden md:block">Program</span></button></Link>
                
                <Popup trigger={<button style={{ fontFamily: 'Roboot-Medium' }} className="flex items-center gap-x-4 bg-purple-500 rounded-xl px-2 py-2 hover:bg-purple-400"><FontAwesomeIcon icon={faPlus} /><span className="hidden md:block">Post</span></button>} modal>
                                    <div className="bg-black p-8 border border-gray-600 rounded-xl w-full px-10 flex flex-col gap-y-4">
                                        
                                        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
                                            <label htmlFor="text" className="sr-only">Create a Post</label>
                                            <textarea className="w-full sm:w-120 h-40 border-none p-4 rounded-xl resize-none focus:outline-none focus:ring-0" id="text" name="text" placeholder="Thoughts? Insight?" onChange={handleChange}></textarea>
                
                                            <button style={{ fontFamily: 'Roboot-Medium' }} className="p-2 bg-purple-500 rounded-xl hover:bg-purple-400" type="submit">Post</button>
                                        </form>
                                    </div>
                </Popup>
            </div>

            <div className="flex flex-col justify-center items-center w-full gap-y-6 overflow-x-hidden md:pl-18 lg:pl-40">
            
            

                {posts.slice().reverse().map(post => {
                
                
                return(
                    <Link to={`/postPage/${post.id}`}><div key={post.id} className="flex flex-row border border-gray-800 px-6 pt-5 pb-1 rounded-lg text-sm md:text-lg w-[300px] sm:w-[470px] lg:w-[650px] gap-x-2">
                        <Link to={`/Profile/${post.poster.id}`}><div className="bg-gray-800 p-4 sm:p-5 h-8 w-8 rounded-full"></div></Link>
                        <div className="flex flex-col gap-y-2" style={{ fontFamily: 'Roboot-Bold' }}>
                            <p><span className="hover:underline"><Link to={`/Profile/${post.poster.id}`}>{post.poster.name}</Link></span> <span style={{ fontFamily: 'Roboot-Medium' }} className="text-gray-500 text-md">{format(new Date(post.createdAt), 'MMM dd')}</span></p>
                            <p style={{ fontFamily: 'Roboot-Medium' }}>{post.text}</p>
                            <div className="flex flex-row items-center hover:text-pink-400"><button className="hover:bg-purple-500/50 h-8 w-8 rounded-full text-gray-700 hover:text-purple-400"><FontAwesomeIcon icon={faComment} /></button> <p className="text-gray-700 text-sm hover:text-purple-400">0</p> 
                            <button className={`hover:bg-rose-500/50 h-8 w-8 rounded-full ${post.likes.some((like) => like.userid == userid) ? "text-red-400 hover:bg-rose-500/50": "text-gray-700 hover:text-pink-400" }`} onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleLike(post.id);}}><FontAwesomeIcon icon={post.likes.some(like => like.userid === userid) ? FilledHeart: EmptyHeart} /></button>
                            <p className="text-gray-700 text-sm hover:text-pink-400">{post._count.likes}</p> </div>
                        </div>
                        
                    </div></Link>
                )})}

            </div>
        </div>
    )
}


export default MainFeed;