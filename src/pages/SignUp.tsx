import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthLogin";
//import { isLoggedIn,setLoggedIn } from "../AuthLogin";


function SignUp(){

    const BackendURL = import.meta.env.VITE_API_URL;
    const LeaveSignUp = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");


    const {isLoggedIn, setIsLoggedIn} = useAuth();
    console.log(isLoggedIn);
    useEffect(()=>{
            if(localStorage.getItem('isLoggedIn') === 'true'){
            LeaveSignUp('/');
        }   
        }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));

        console.log(!isblank);
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const isblank = formData.name && formData.email && formData.password

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // reset error on new submit

    try {
        const response = await fetch(`${BackendURL}/Users`, {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            // Check for duplicate email
            if (response.status === 409) {
                setErrorMessage("An account with this email already exists.");
                return;
            }

            // Try to read backend error message
            const data = await response.json().catch(() => null);

            if (data?.error) {
                setErrorMessage(data.error);
            } else {
                setErrorMessage("Failed to create user. Please try again.");
            }

            return;
        }

        // SUCCESS CASE
        const currentUser = await response.json();
        console.log(currentUser);

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);

        LeaveSignUp("/");
    } catch (err) {
        console.log("ERROR: ", err);
        setErrorMessage("Something went wrong. Please try again later.");
    }
};


    return(

        <div className="flex flex-col items-center justify-center min-w-screen">
            <div className="flex flex-col p-4 gap-y-6 rounded-xl 3/4">

                <div>
                    <h1 className="text-center py-4 text-2xl">The Social Network</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 w-full">
                    
                    <label htmlFor="name" className="sr-only">Enter a Nickname</label>
                    <input id="name" name="name" type="text" placeholder="Nickname" value={formData.name} onChange={handleChange} className="border-2 border-gray-700 rounded-xl py-3 px-4 w-96"></input>


                    <label htmlFor="email" className="sr-only">Enter a email</label>
                    <input id="email" name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} className="border-2 border-gray-700 rounded-xl py-3 px-4"></input>

                    <label htmlFor="password" className="sr-only">Enter a Password</label>
                    <input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border-2 border-gray-700 rounded-xl py-3 px-4"></input>

                    {errorMessage && (
                        <div className="bg-red-900/40 text-red-300 p-2 rounded-lg text-sm text-center">
                            {errorMessage}
                        </div>
                    )}
                    
                    <button className="rounded-xl py-3 px-4 bg-purple-500 hover:bg-purple-400 hover:text-black disabled:opacity-50 disabled:pointer-events-none" type="submit" id="sub_button" disabled={!isblank}>Submit</button>
                </form>
            </div>
            <p className="text-purple-300"><span className="text-gray-400">Already have an account?</span> <Link to="/Login">Login.</Link></p>
        </div>
    )
}

export default SignUp;