// Sidebar.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthLogin";
import EmojiPicker, {type EmojiClickData, Theme } from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faMagnifyingGlass,
    faCode,
    faBell,
    faEnvelope,
    faPlus,
    faEllipsisH,
    faTimes,
    faImage,
    faSmile
} 


from "@fortawesome/free-solid-svg-icons";

const Sidebar: React.FC = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [image, setImage] = useState("");
    //const [postText, setPostText] = useState("");
    const navigate = useNavigate();

    const currentUser = isLoggedIn
    ? JSON.parse(localStorage.getItem("currentUser") || "{}")
    : null;

    const links = [
        { icon: faHouse, text: "Home", page: "/MainFeed" },
        { icon: faMagnifyingGlass, text: "Explore", page: "/Explore" },
        { icon: faCode, text: "Program", page: "/Program" },
        { icon: faBell, text: "Notifications", page: "/Notifications" },
        { icon:faEnvelope, text: "Messages", page: "/Messages" },
    ];

    function SignOut() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        setIsLoggedIn(false);
        setMenuOpen(false);
    }

    type formdatatype = {
        text: string;
        file: string;
    }

    const [file, setFile] = useState<string>("");
    const [fileTuah, setFileTuah] = useState<string | undefined>("");
    
    const [formData, setFormData] = useState<formdatatype>({
        text: "",
        file: file
    });

    useEffect(() => {
            fetch(`${BackendURL}/get/image/${currentUser.id}`)
            .then(res => res.json())
            .then(data => {
                setImage(data.url)
            })
    
    }, []);

    const BackendURL = import.meta.env.VITE_API_URL;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = () => {
    // Programmatically click the hidden input
    fileInputRef.current?.click();
    if (fileInputRef.current?.files?.[0]) {
        setFileTuah(fileInputRef.current.files[0].name);
    }
  };
    
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        
        setFormData(prev => ({...prev, [e.target.name]: e.target.value,
            })
        );
        console.log(formData.text);
    }

    const handleSubmit = async (e: React.FormEvent) => {
       
        e.preventDefault();

        

        
        // Step 1: upload the image if one exists
        if (fileInputRef.current?.files?.[0]) {
            setFile("");
            const fileToUpload = fileInputRef.current.files[0];
            setFileTuah(fileInputRef.current.files[0].name);
            const imageData = new FormData();
            imageData.append("file", fileToUpload);
            
        }

        const fileToUpload = fileInputRef.current?.files?.[0];

            // Step 2: create post
        
        const formDataToSend = new FormData();

        if(fileToUpload){
            formDataToSend.append("file", fileToUpload);
        }
        
        formDataToSend.append("text", formData.text);

        try {
            const response = await fetch(`${BackendURL}/CreatePost/${currentUser.id}`, {
            method: "POST",
            body: formDataToSend,
            });

        if (response.ok) {
            console.log("Post created successfully!");
            
            }
        } catch (error) {
            alert(error);
        }
        
    };

    const [preview, setPreview] = useState<string>("");
    const dafileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if(e.target.files?.[0]){
            setFileTuah(e.target.files?.[0].name);
            
        }
        if(file){
            setPreview(URL.createObjectURL(file));
        }
    }
    
    return (
        <aside style={{ fontFamily: 'Roboot-Medium' }} className="fixed top-0 left-0 h-full w-1/5 bg-black text-white p-4 hidden md:flex flex-col justify-between font-roboto border-r border-gray-700">
            <Link to="/" className="mb-6 flex items-center text-xl font-bold">The Social Network</Link>
            <div className="flex flex-col space-y-3">
                {links.map((link, idx) => (
                    <Link
                        to={`${link.page}`}
                        key={idx}
                        reloadDocument
                        // style={{ fontFamily: 'Roboot-Medium' }}
                        className="gap-3 px-4 py-2 rounded-full transition-colors duration-200 text-xl hover:bg-gray-800 flex items-center">
                        <FontAwesomeIcon icon={link.icon} />
                        <span className="text-left">{link.text}</span>
                    </Link>
                ))}
                <button onClick={() => {setIsPostModalOpen(true);}} className="gap-3 px-4 py-2 rounded-full transition-colors duration-200 text-xl bg-white text-black hover:bg-gray-200">
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="text-left"> Post</span>
                </button>

            </div>

            {/* Profile Section */}
            {!isLoggedIn ? (
                <Link to="/Login" className="flex items-center justify-center px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200">Login</Link>
            ) : (
                <div className="relative flex items-center justify-between px-4 py-2 rounded-full hover:bg-gray-800">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${currentUser?.id || ""}`)}>
                        <img src={image} alt="Profile" className="w-10 h-10 rounded-full"/>
                        <div className="flex flex-col leading-tight">
                            <span className="font-bold">{currentUser?.name || "User"}</span>
                            <span className="text-sm text-gray-400">@username</span>
                        </div>
                    </div>

                    <button className="ml-2 p-2 hover:bg-gray-700 rounded-full" onClick={(e) => {e.stopPropagation(); setMenuOpen((prev) => !prev);}}>
                        <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
                    </button>

                    {/* Pop-up Menu */}
                    {menuOpen && (
                        <div className="absolute bottom-14 left-10 bg-black text-white rounded-lg py-2 w-40 shadow-[0_0_5px_grey]">
                            <button className="w-full text-left px-4 py-2 hover:bg-red-500" onClick={SignOut}>Log Out</button>
                        </div>
                    )}
                </div>
            )}

            {/* Post Modal */}
            {isPostModalOpen && (
                <div className="fixed inset-0 flex items-start justify-center z-50">
                    {/* Dimmed background */}
                    <div className="absolute inset-0 bg-black opacity-60" onClick={() => setIsPostModalOpen(false)}></div>

                    {/* Modal content */}
                    <div className="relative bg-black text-white rounded-lg shadow-lg p-6 w-full max-w-lg z-10 mt-20">
                    <form onSubmit={(e) => {handleSubmit(e); setIsPostModalOpen(false); setFileTuah(""); setPreview("");}}>
                        <button type="button" className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-800" onClick={() => {setIsPostModalOpen(false); setFileTuah(""); setPreview("");}}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Create a Post</h2>

                        <textarea 
                            id="text"
                            name="text"
                            value={formData.text}
                            placeholder="What's happening?"
                            onChange={handleChange}
                            className="w-full bg-black text-white placeholder-gray-400 focus:outline-none resize-none p-2 mb-4"
                            rows={4}
                        ></textarea>
                        {fileTuah?.includes(".mp4") ? <video autoPlay controls className="rounded-lg max-h-70" src={preview}/> : <img className="max-h-70 rounded-lg" src={preview}/>}
                        {/* Footer buttons */}
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-4">
                                {/* Image button */}
                                <div className="flex flex-row">
                                    <button type="button" onClick={handleButtonClick} className="p-2 rounded-full hover:bg-gray-800">
                                        <FontAwesomeIcon icon={faImage} />
                                    </button>
                                    <input type="file" onChange={dafileChange} ref={fileInputRef} style={{display: "none"}} accept=".png, .jpg, .jpeg, .mp4"></input>
                                    <p className="flex items-center text-gray-500">{fileTuah}</p>
                                </div>
                                {/* Emoji button */}
                                <div className="relative">
                                    <button type="button" className="p-2 rounded-full hover:bg-gray-800" onClick={(e) => {setShowEmojiPanel((prev) => !prev);  e.stopPropagation()}}>
                                        <FontAwesomeIcon icon={faSmile} />
                                    </button>

                                    {/* Emoji Picker */}
                                    {showEmojiPanel && (
                                        <div className="absolute top-6 left-0 z-50" style={{ transform: "scale(0.8)" }} onClick={(e) => e.stopPropagation()}>
                                            <EmojiPicker
                                                theme={Theme.DARK}
                                                width={300}
                                                height={350}
                                                onEmojiClick={(emojiData: EmojiClickData, event) => {
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                    setFormData((prev) => ({...prev, text: prev.text + emojiData.emoji}));
                                                    setShowEmojiPanel(false);
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                </div>
                            </div>

                            {/* Post button */}
                            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-400">
                                Post
                            </button>

                        </div>
                    </form>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
