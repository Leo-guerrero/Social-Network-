import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthLogin";
import Popup from "reactjs-popup";

function NavBar(){

    const {isLoggedIn, setIsLoggedIn} = useAuth();

    function SignOut(){
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
    }

    const Tooltip = () => (
  <Popup
    trigger={() => (
      <button className="button py-6 px-6 bg-gray-800 rounded-full"></button>
    )}
    position="bottom center"
    closeOnDocumentClick
  >
    <div className="flex flex-col items-center p-3 bg-black border border-gray-800 rounded-xl gap-y-2 px-4">
        <Link to="/Profile"><button className="text-sm border border-gray-800 p-2 px-4 rounded-lg">Profile</button></Link> 
        <button style={{ fontFamily: 'Roboot-light' }} className="text-sm border border-gray-800 p-2 px-4 rounded-lg hover:bg-red-500" onClick={SignOut}>Sign Out</button>
    </div>
    
  </Popup>
);

    const signUpButtons = 
    <div className="absolute right-4 flex gap-x-2">
        <Link to="/SignUp"><button style={{ fontFamily: 'Roboot-light' }} className="text-sm border border-gray-800 p-2 px-4 rounded-lg hover:bg-purple-500 hover:text-black">Sign up</button></Link>
        <Link to="/Login"><button style={{ fontFamily: 'Roboot-light' }} className="text-sm border border-gray-800 p-2 px-4 rounded-lg hover:bg-purple-500 hover:text-black">Login</button></Link>
    </div>

    const loggedIn = 
    <div className="absolute right-4 flex gap-x-2">
        <button style={{ fontFamily: 'Roboot-light' }} className="text-sm border border-gray-800 p-2 px-4 rounded-lg hover:bg-red-500" onClick={SignOut}>Sign Out</button>
        </div>

    return (
        
        <div className="w-full flex fixed top-0 w-full py-2 border-b-1 border-gray-900 bg-black">
           

            <div className="hidden md:block">
                <Link to="/"><button><span style={{ fontFamily: 'Roboot-Medium' }} className="px-4 text-lg">The Social Network</span></button></Link>
                <Link to="/MainFeed"><button style={{ fontFamily: 'Roboot-Medium' }} className="NavButton">Home</button></Link>
                <button className="NavButton" style={{ fontFamily: 'Roboot-Medium' }}>Contact</button>
                <Link to="/backendtest"><button className="NavButton">Backend</button></Link>
            </div>

            <div className="block md:hidden">
                <Link to="/"><button style={{ fontFamily: 'Roboot-Medium' }} className="py-[0.5em] px-[1em] text-lg">SN</button></Link>
            </div>


            {isLoggedIn ? loggedIn : signUpButtons}

        </div>
        
    )
}



export default NavBar;

// <div className="absolute left-4 py-2 text-lg RoobootMedium">The Social Network</div>