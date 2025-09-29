import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faComment, faUser } from "@fortawesome/free-regular-svg-icons";
import { faCode, faHeart as FilledHeart} from "@fortawesome/free-solid-svg-icons";
import { faHeart as EmptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHouse, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import Popup from "reactjs-popup";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import Sidebar from '../components/Sidebar'

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

    }, []);
    console.log("Post tuah:", posts);

    // const topLevelPosts = posts.filter(post => !post.parentId);
   
    
    return (
        <div className="grid grid-cols-[1fr_2fr_1fr] min-h-screen border-x border-gray-300 bg-black">
            <Sidebar />
            {/* Left Column */}
            <div className="flex flex-col justify-between h-screen border-r border-gray-300 p-4 bg-black">
                <div className="space-y-4">
                    <button onClick={reloadPage} className="w-full rounded-full bg-black text-white px-6 py-2 hover:bg-gray-900" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faHouse} /> Home</button>
                    <Link to="" className="flex items-center justify-start w-full rounded-full bg-black text-white px-6 py-2 hover:bg-gray-900 text-lg" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faMagnifyingGlass} className="mr-3"/>Explore</Link>
                    <Link to="/Program" className="flex items-center justify-start w-full rounded-full bg-black text-white px-6 py-2 hover:bg-gray-900 text-lg" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faCode} className="mr-3"/>Program</Link>
                    <Link to="" className="flex items-center justify-start w-full rounded-full bg-black text-white px-6 py-2 hover:bg-gray-900 text-lg" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faCode} className="mr-3"/>Notifications</Link>
                    <Link to="" className="flex items-center justify-start w-full rounded-full bg-black text-white px-6 py-2 hover:bg-gray-900 text-lg" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faMagnifyingGlass} className="mr-3"/>Messages</Link>
                    <Link to={`/Profile/${currentUser.id}`} className="flex items-center justify-start w-full rounded-full bg-black text-white px-6 py-2 hover:bg-gray-900 text-lg" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faUser} className="mr-3"/>Profile</Link>
                    
                    <Popup trigger={<button style={{ fontFamily: 'Roboot-Medium' }} className="w-full rounded-full bg-white text-black font-bold px-6 py-2 hover:bg-gray-200"><FontAwesomeIcon icon={faPlus} />Post</button>} modal>
                                        <div className="bg-black p-8 border border-gray-600 rounded-xl w-full px-10 flex flex-col gap-y-4">
                                            
                                            <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
                                                <label htmlFor="text" className="sr-only">Create a Post</label>
                                                <textarea className="w-full sm:w-120 h-40 border-none p-4 rounded-xl resize-none focus:outline-none focus:ring-0" id="text" name="text" placeholder="Thoughts? Insight?" onChange={handleChange}></textarea>
                    
                                                <button style={{ fontFamily: 'Roboot-Medium' }} className="p-2 bg-purple-500 rounded-xl hover:bg-purple-400" type="submit">Post</button>
                                            </form>
                                        </div>
                    </Popup>
                </div>

                <div>
                    <Link to={`/Profile/${currentUser.id}`}><img src="https://d3k8b7apyvc2wb.cloudfront.net/test.png" alt="Profile" className="rounded-full cursor-pointer hover:ring-2 hover:ring-gray-400"></img></Link>
                </div>

            </div>

            {/* Middle Column */}
            <div className="p-4 bg-black">
            
            

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

            {/* Right Column */}
            <div className="border-l border-gray-300 p-4">
                Right
            </div>
        </div>
    )
}


export default MainFeed;