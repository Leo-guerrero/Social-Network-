import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthLogin";

function Login(){
    const BackendURL = import.meta.env.VITE_API_URL;

    const LeaveLogin = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('isLoggedIn') === 'true'){
        LeaveLogin('/');
    }   
    }, []);
        
    const {isLoggedIn, setIsLoggedIn} = useAuth();
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData(prev => ({...prev, [e.target.name]: e.target.value,
            })
        );
        console.log(formData.email)
    };

    const [formData, setFormData] = useState({
        email: "", 
        password: ""
    });

    const isblank = formData.email && formData.password

    const handelSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();

        try{

            const response = await fetch(`${BackendURL}/LoginCheck`, {
                method: 'POST',
                headers: {
                    "content-Type" : "application/json",
                },
                body: JSON.stringify(formData)
            });
                
            if(!response.ok){
                console.log('Failed to verify');
                throw new Error("Failed to verify user")
                
            }

            if(response.ok){
                const currentUser = await response.json();
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('isLoggedIn', 'true');
                setIsLoggedIn(true);

                LeaveLogin('/');
            }

        } catch(err){
            console.log(err);
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-w-screen space-y-8">
            <div className="text-2xl" style={{fontFamily: 'Roboot-Medium' }}>
                Welcome Back
            </div>

            <form onSubmit={handelSubmit} className="flex flex-col gap-y-6 w-96">
                <label htmlFor="email" className="sr-only">Enter your Email</label>
                <input id="email" type="email" name="email" placeholder="Email Address" className="border-2 border-gray-700 rounded-xl py-3 px-4" onChange={handleChange}></input>

                <label htmlFor="password" className="sr-only">Enter your Password</label>
                <input type="password" name="password" id="password" placeholder="Password" className="border-2 border-gray-700 rounded-xl py-3 px-4" onChange={handleChange}></input>

                <button type="submit" id="submit_button" className="rounded-xl py-3 px-4 bg-purple-500 hover:bg-purple-400 hover:text-black disabled:opacity-50 disabled:pointer-events-none" disabled={!isblank}>Submit</button>
            </form>
        </div>
    )
}


export default Login;