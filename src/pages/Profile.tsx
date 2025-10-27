import { faComment, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faCalendarDays} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useState, type ChangeEvent} from "react";
import { Link, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import { useParams } from "react-router-dom";
import { faHeart as FilledHeart} from "@fortawesome/free-solid-svg-icons";
import { faHeart as EmptyHeart } from "@fortawesome/free-regular-svg-icons";


function Profile(){
    const BackendURL = import.meta.env.VITE_API_URL;

    const params = useParams();

    console.log("The param id is: " + params.id);

    const LeaveProfile = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('isLoggedIn') === null){
        LeaveProfile('/Login');
    }   
    }, []);

    type User = {
        id: number;
        email: string;
        name: string;
        createdAt: string;
    }

    type Post = {
        id: number;
        userid: number;
        text: string;
        createdAt: string;
        imageURL: string;
        likes: {
            userid: number;
        }[],
        poster: {
            name: string;
        };
        _count: {
            likes: number;
        }
    }

    type ProfileStuff = {
        userid: number;
        bio: string;
    };

    const [formData, setFormData] = useState({
        bio: ""
    });

    const [image, setImage] = useState("");
    useEffect(() => {
                fetch(`${BackendURL}/get/image/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setImage(data.url)
                    
                })
        
        }, []);

    console.log(image);

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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        

        setFormData(prev => ({...prev, [e.target.name]: e.target.value,
            })
        );
        console.log(formData.bio);
    }

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();

        try{
            fetch(`${BackendURL}/profilesUpdate/${params.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(updated => {
                setProfileInfo(updated)
            })

        } catch(err) {
            console.log(err);
        }
    }


    const [usersPosts, setUsersPosts] = useState<Post[]>([])

    const [profileInfo, setProfileInfo] = useState<ProfileStuff | null>(null);

    const [userInfo, setUserInfo] = useState<User | null>(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

     const userid = currentUser.id

    if(currentUser.id != params.id){
        const edit_profile = document.getElementById("editProfile");
        const post_profile = document.getElementById("postProfile");

        if(edit_profile){
            edit_profile.style.display="none";
        }

        if(post_profile){
            post_profile.style.display="none";
        }
        
    }

    
    
    

    useEffect(() => {
        fetch(`${BackendURL}/profiles/${params.id}`)
        .then(res => res.json())
        .then(data => {
            setProfileInfo(data);
        })
    },[]);

    useEffect(() => {
        fetch(`${BackendURL}/UserSpecific/${params.id}`)
        .then(res => res.json())
        .then(data => {
            setUsersPosts(data);
           
        })
    },[]);

    useEffect(() => {
        fetch(`${BackendURL}/User/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setUserInfo(data);

                console.log(userInfo)
            })
    }, []);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    console.log(selectedFile);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setSelectedFile(file);

        const ImageData = new FormData();
        ImageData.append("file", file);

        const response = await fetch(`${BackendURL}/put/image/${currentUser.id}`, {
        method: "POST",
        body: ImageData,
        });

        const data = await response.json();
        console.log(data);
        }
    };

    function dothing(){
        console.log("yo");
    }

    return (
        <div className="p-4 flex flex-col justify-start items-center w-screen h-screen gap-y-4 py-20 overflow-x-hidden">
            
            <div className="flex flex-col bg-black p-8 rounded-xl border border-gray-800 w-full md:w-1/2 gap-y-4">
            <div style={{ fontFamily: 'Roboot-bold' }} className="flex flex-row items-center space-x-6 text-2xl">
                <Link to="/MainFeed"><FontAwesomeIcon icon={faArrowLeft} /></Link>
                <p className="text-2xl" style={{ fontFamily: 'Roboot-bold' }}>Profile</p>
            </div>
                <img src={image} onClick={dothing} className="h-32 w-32 rounded-full hover:brightness-50 transition ease-in-out hover:cursor-pointer"/>

                <div><p className="text-2xl pr-20" style={{ fontFamily: 'Roboot-Bold' }}>{userInfo?.name}</p></div>
                <div><p className="text-lg pr-20 text-gray-500" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faCalendarDays} /> Joined {format(new Date(userInfo?.createdAt ?? Date.now()), 'MMM dd')}</p></div>
                <div><p className="text-lg" style={{ fontFamily: 'Roboot-Medium' }}>{profileInfo?.bio}</p> </div>
                <Popup trigger={<button id="editProfile" style={{ fontFamily: 'Roboot-Medium' }} className="button text-sm border border-gray-800 py-2 rounded-lg w-32 sm:w-64 hover:bg-purple-500"><FontAwesomeIcon icon={faPenToSquare} /> Edit Profile </button>} modal>
                    <div className="bg-black p-12 border border-gray-600 rounded-xl w-full px-10 flex flex-col gap-y-4">
                        <p className="text-xl font-bold">Edit Profile</p>
                        <p className="text-md">Profile Picture</p>
                        <div className="p-2 border border-gray-700 rounded-xl"><input placeholder="Profile Picture" className="hover:cursor-pointer" onChange={handleFileChange} type="file"></input></div>
                        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
                            <label htmlFor="bio" className="sr-only">Add/Edit a Bio</label>
                            <textarea className="w-full sm:w-96 h-40 border border-gray-700 p-4 rounded-xl resize-none" id="bio" name="bio" placeholder="Tell us about yourself..." onChange={handleChange}></textarea>

                            <button style={{ fontFamily: 'Roboot-Medium' }} className="p-2 bg-purple-500 rounded-xl hover:bg-purple-400" type="submit">Save</button>
                        </form>
                    </div>
                </Popup>
                
                
            </div>

            <div className="flex flex-col gap-y-2 border border-gray-800 rounded-xl px-12 w-full md:w-1/2 py-6">
                <p className="text-2xl">Posts</p>

                {usersPosts.slice().map(post =>(
                    <Link to={`/postPage/${post.id}`}><div key={post.id} className="flex flex-row border border-gray-800 px-6 pt-5 pb-1 rounded-lg text-sm md:text-lg w-[220px] sm:w-[470px] lg:w-[650px] gap-x-2">
                        <img src={image} className="h-8 w-8 rounded-full hover:brightness-50 transition ease-in-out" />
                        <div className="flex flex-col gap-y-2" style={{ fontFamily: 'Roboot-Bold' }}>
                            <p>{post.poster.name} <span style={{ fontFamily: 'Roboot-Medium' }} className="text-gray-500 text-md">{format(new Date(post.createdAt), 'MMM dd')}</span></p>
                            <p style={{ fontFamily: 'Roboot-Medium' }}>{post.text}</p>
                            {post.imageURL.includes("mp4") ? ( 
                                <video onClick={(e) => {e.preventDefault(); e.stopPropagation();}} className="rounded-lg max-h-100" src={post.imageURL} autoPlay muted controls/>
                                ) : (
                                <img className="rounded-lg max-h-100" src={post.imageURL} />
                            )}
                            <div className="flex flex-row items-center hover:text-pink-400"><button className="hover:bg-purple-500/50 h-8 w-8 rounded-full text-gray-700 hover:text-purple-400"><FontAwesomeIcon icon={faComment} /></button> <p className="text-gray-700 text-sm hover:text-purple-400">0</p> <button className={`hover:bg-rose-500/50 h-8 w-8 rounded-full ${post.likes.some((like) => like.userid == userid) ? "text-red-400 hover:bg-rose-500/50": "text-gray-700 hover:text-pink-400" }`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike(post.id);}}><FontAwesomeIcon icon={post.likes.some(like => like.userid === userid) ? FilledHeart: EmptyHeart} /></button>
                            <p className="text-gray-700 text-sm hover:text-pink-400">{post._count.likes}</p> </div>
                        </div>
                        
                    </div></Link>
                ))}
            
            </div>
            
        </div>
    )
}

export default Profile;