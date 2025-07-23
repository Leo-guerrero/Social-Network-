import { faHeart, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCalendarDays, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import { useParams } from "react-router-dom";

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

    

    const handleLike = async(postid: number) =>{
        try{
            const response = await fetch(`${BackendURL}/LikeUnLike`, {
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

    const handleSubmitPOST = async(e: React.FormEvent ) =>{
        e.preventDefault();

        try {
            const response = await fetch(`${BackendURL}/CreatePost/${currentUser.id}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            if(response.ok){
                window.location.reload();
            }

        } catch(error){
            console.log(error);
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

    const NickName = currentUser.name
    
    

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

    

    return (
        <div className="p-4 flex flex-col justify-start items-center w-screen h-screen gap-y-4 py-20 overflow-x-hidden">
            
            <div className="flex flex-col bg-black p-8 rounded-xl border border-gray-800 w-full md:w-1/2 gap-y-4">
                <div className="bg-gray-800 rounded-full p-18 w-32"></div>

                <div><p className="text-2xl pr-20" style={{ fontFamily: 'Roboot-Bold' }}>{userInfo?.name}</p></div>
                <div><p className="text-lg pr-20 text-gray-500" style={{ fontFamily: 'Roboot-Medium' }}><FontAwesomeIcon icon={faCalendarDays} /> Joined {format(new Date(userInfo?.createdAt ?? Date.now()), 'MMM dd')}</p></div>
                <div><p className="text-lg" style={{ fontFamily: 'Roboot-Medium' }}>{profileInfo?.bio}</p> </div>
                <Popup trigger={<button id="editProfile" style={{ fontFamily: 'Roboot-Medium' }} className="button text-sm border border-gray-800 py-2 rounded-lg w-32 sm:w-64 hover:bg-purple-500"><FontAwesomeIcon icon={faPenToSquare} /> Edit Profile </button>} modal>
                    <div className="bg-black p-12 border border-gray-600 rounded-xl w-full px-10 flex flex-col gap-y-4">
                        <p className="text-xl font-bold">Edit Profile</p>
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
                    <div key={post.id} className="flex flex-row border border-gray-800 px-6 pt-5 pb-1 rounded-lg text-sm md:text-lg w-[220px] sm:w-[470px] lg:w-[650px] gap-x-2">
                        <div className="bg-gray-800 p-4 sm:p-5 h-8 w-8 rounded-full"></div>
                        <div className="flex flex-col gap-y-2" style={{ fontFamily: 'Roboot-Bold' }}>
                            <p>{post.poster.name} <span style={{ fontFamily: 'Roboot-Medium' }} className="text-gray-500 text-md">{format(new Date(post.createdAt), 'MMM dd')}</span></p>
                            <p style={{ fontFamily: 'Roboot-Medium' }}>{post.text}</p>
                            <div className="flex flex-row items-center hover:text-pink-400"> <button className="flex flex-row items-center text-gray-700 hover:text-pink-400"  onClick={() => handleLike(post.id)}><FontAwesomeIcon className="hover:bg-rose-500/50 p-2 rounded-full" icon={faHeart} />
                            <p className="text-sm">{post._count.likes}</p></button> </div>
                        </div>
                        
                    </div>
                ))}
            
            </div>
            
        </div>
    )
}

export default Profile;