import { Link } from "react-router-dom";

function NavBar(){
    return (
        
        <div className="w-full flex fixed top-0 w-full py-2 border-b-1 border-gray-900">
           

            <div className="">
                <Link to="/"><button><span style={{ fontFamily: 'Roboot-Medium' }} className="px-4 text-lg">The Social Network</span></button></Link>
                <button className="NavButton">About</button>
                <button className="NavButton">Contact</button>
                <Link to="/backendtest"><button className="NavButton">Backend</button></Link>
            </div>

            <div className="absolute right-4 flex gap-x-2">
                <button style={{ fontFamily: 'Roboot-light' }} className="text-sm border border-gray-800 p-2 px-4 rounded-lg hover:bg-purple-500 hover:text-black">Sign up</button>
                <button style={{ fontFamily: 'Roboot-light' }} className="text-sm border border-gray-800 p-2 px-4 rounded-lg hover:bg-purple-500 hover:text-black">Login</button>
            </div>

        </div>
        
    )
}



export default NavBar;

// <div className="absolute left-4 py-2 text-lg RoobootMedium">The Social Network</div>