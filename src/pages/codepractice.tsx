import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function codepractice(){

    type Problem = {
        id: number;
        userid: number;
        name: String;
        difficulty: String;
        desc: String;
        startCode: String;
        testCaseCode: String;
    }

    const [problems, setProblems] = useState<Problem[]>([]);

    const BackendURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${BackendURL}/get/all/Problems`)
        .then(res => res.json())
        .then(data => {
            setProblems(data)
        })

    }, []);

    return(

        <>
            
            <div className="flex flex-col p-4 space-y-2">
                <div style={{ fontFamily: 'Roboot-bold' }} className="flex flex-row items-center space-x-6 text-2xl">
                    <Link to="/MainFeed"><FontAwesomeIcon icon={faArrowLeft} /></Link>
                    <p>back</p>
                </div>
                {problems.map(problem => {
                    return (
                        <Link to={`/Problem/${problem.id}`}><div className={`${problem.id % 2 == 0 ? "border-1 border-gray-800 bg-gray-700 rounded-lg px-4 py-2 flex flex-row justify-between space-x-22" : "rounded-lg px-4 py-2 flex flex-row justify-between space-x-22"}`}><div className="font-bold">{problem.id}. {problem.name}</div><div className={`${problem.difficulty == "Easy" ? "text-green-500" : problem.difficulty == "Med" ? "text-yellow-500" : "text-red-600"}`}>{problem.difficulty}</div></div></Link>
                    );
                })}
                
            </div>
        </>


    );

}

export default codepractice;