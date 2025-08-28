import { Link } from "react-router-dom";

function codepractice(){

    return(
        <div className="flex flex-col p-4 space-y-2">
            
            <Link to="/Problem"><div className="rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"><div className="font-bold">1. Two Sum</div><div className="text-green-500">Easy</div></div></Link>
            <div className="border-1 border-gray-800 bg-gray-700 rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"><div className="font-bold">2. Add Two Numbers</div><div className="text-green-500">Easy</div></div>
            <div className="rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"><div className="font-bold">3. Longest Substring Without Repeating Characters</div><div className="text-yellow-500">Med</div></div>
            <div className="border-1 border-gray-800 bg-gray-700 rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"><div className="font-bold">4. Median of Two Sorted Arrays</div><div className="text-red-600">Hard</div></div>
            
        </div>


    );

}

export default codepractice;