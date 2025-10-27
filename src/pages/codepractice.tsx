import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";


function codepractice(){

    return(

        <>
            
            <div className="flex flex-col p-4 space-y-2">
                <div style={{ fontFamily: 'Roboot-bold' }} className="flex flex-row items-center space-x-6 text-2xl">
                    <Link to="/MainFeed"><FontAwesomeIcon icon={faArrowLeft} /></Link>
                    <p>back</p>
                </div>
                <Link to={`/Problem/${1}`}><div className="rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"><div className="font-bold">1. Two Sum</div><div className="text-green-500">Easy</div></div></Link>
                <Link to={`/Problem/${2}`}><div className="border-1 border-gray-800 bg-gray-700 rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"><div className="font-bold">2. Add Two Numbers</div><div className="text-yellow-500">Med</div></div></Link>
                <div className="rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"><div className="font-bold">3. Longest Substring Without Repeating Characters</div><div className="text-yellow-500">Med</div></div>
                <div className="border-1 border-gray-800 bg-gray-700 rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"><div className="font-bold">4. Median of Two Sorted Arrays</div><div className="text-red-600">Hard</div></div>
                
            </div>
        </>


    );

}

export default codepractice;