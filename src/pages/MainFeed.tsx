import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faComment} from "@fortawesome/free-regular-svg-icons";
import { faHeart as FilledHeart} from "@fortawesome/free-solid-svg-icons";
import { faHeart as EmptyHeart } from "@fortawesome/free-regular-svg-icons";
//import { faHouse, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
//import Popup from "reactjs-popup";
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

    /*
    function reloadPage(){
        window.location.reload();
    }*/

    type Post = {
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

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const userid = currentUser.id

    /*
    const [formData, setFormData] = useState({
        text: ""
    });*/

    const [posts, setPosts] = useState<Post[]>([]);

    /*
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
    */
    

    useEffect(() => {
        fetch(`${BackendURL}/GetAllPosts`)
        .then(res => res.json())
        .then(data => {
            setPosts(data)
        })

    }, []);

    const [image, setImage] = useState("");
    console.log(image);
    useEffect(() => {
                fetch(`${BackendURL}/get/image/${currentUser.id}`)
                .then(res => res.json())
                .then(data => {
                    setImage(data.url)
                })
        
        }, []);
    console.log("Post tuah:", posts);

    // const topLevelPosts = posts.filter(post => !post.parentId);
   
    
    return (
        <div style={{ fontFamily: 'Roboot-Medium' }} className="min-h-screen w-screen">
            <div className="h-full w-full grid gap-4 [grid-template-columns:19%_40%_39%]">
                {/* Left Column (19%) Allocated Space for Sidebar */}
                <section className="p-4">
                    <Sidebar></Sidebar>
                </section>
                {/* Middle Column (40%) Posts Feed */}
                <section className="border-r border-gray-700">
                    {/* === Posts Feed === */}
                    {posts.slice().map(post => {
                    {console.log("da URLs", post.poster.profileURL)}
                    
                    return(
                        <Link to={`/postPage/${post.id}`}><div key={post.id} className="flex flex-row border border-gray-700 px-6 pt-5 pb-1 text-sm md:text-lg w-[300px] sm:w-[470px] lg:w-[650px] gap-x-2">
                            <Link to={`/Profile/${post.poster.id}`}><img src={post.poster.profileURL} className="h-8 w-8 min-w-8 min-h-8 rounded-full object-cover"/></Link>
                            <div className="flex flex-col gap-y-2" style={{ fontFamily: 'Roboot-Bold' }}>
                                <p><span className="hover:underline"><Link to={`/Profile/${post.poster.id}`}>{post.poster.name}</Link></span> <span style={{ fontFamily: 'Roboot-Medium' }} className="text-gray-500 text-md">{format(new Date(post.createdAt), 'MMM dd')}</span></p>
                                <p style={{ fontFamily: 'Roboot-Medium' }}>{post.text}</p>
                                {post.imageURL.includes("mp4") ? ( 
                                    <video onClick={(e) => {e.preventDefault(); e.stopPropagation();}} className="rounded-lg max-h-100" src={post.imageURL} autoPlay muted controls/>
                                    ) : (
                                    <img className="rounded-lg max-h-100" src={post.imageURL} />
                                )}
                                <div className="flex flex-row items-center hover:text-pink-400"><button className="hover:bg-purple-500/50 h-8 w-8 rounded-full text-gray-700 hover:text-purple-400"><FontAwesomeIcon icon={faComment} /></button> <p className="text-gray-700 text-sm hover:text-purple-400">0</p> 
                                <button className={`hover:bg-rose-500/50 h-8 w-8 rounded-full ${post.likes.some((like) => like.userid == userid) ? "text-red-400 hover:bg-rose-500/50": "text-gray-700 hover:text-pink-400" }`} onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleLike(post.id);}}><FontAwesomeIcon icon={post.likes.some(like => like.userid === userid) ? FilledHeart: EmptyHeart} /></button>
                                <p className="text-gray-700 text-sm hover:text-pink-400">{post._count.likes}</p> </div>
                            </div>
                            
                        </div></Link>
                        
                    )})}

                </section>
                {/* Right Column (40%) News */}
                <section className="">
                    {/* News */}
                    {/* <h2 className="text-xl font-bold mb-2">News</h2> */}
                    
                </section>
            </div>
        </div>
    )
}

export default MainFeed;


