import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProbHistUser() {

    type SolvedProblems = {
        id: number;
        userid: number;
        problemid: number;
        numSolved: number;
        currentUserCode: string;
        createdAt: string;
        problem: {
            id: number;
            name: string;
            difficulty: string;
            desc: string;
        }
    }
 
    const params = useParams();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const BackendURL = import.meta.env.VITE_API_URL;
    const [solvedProblems, setSolvedProblems] = useState<SolvedProblems[]>([]);
    let attemptCount = 1;

    useEffect(() => {
        
        const extra = currentUser.id;
        fetch(`${BackendURL}/get/history/ofUsersSubmits/${params.id}?extra=${extra}`)
            .then(res => res.json())
            .then(data => setSolvedProblems(data));

            console.log(solvedProblems);
    }, []);




    return (
        <div className="flex flex-col p-4 space-y-4">
            <div className="flex flex-row">
                <Link to={`/Profile/${currentUser.id}`} className="text-4xl"><FontAwesomeIcon icon={faArrowLeft} />&nbsp;</Link>
                <p style={{ fontFamily: 'Roboot-Medium' }} className="text-4xl">History</p>
            </div>
            {solvedProblems.length > 0 && (
            <Link to={`/Problem/${solvedProblems[0].problem.id}`}>
                <button
                style={{ fontFamily: 'Roboot-Medium' }}
                className="bg-purple-500 px-2 rounded-md text-xl max-w-48 hover:bg-purple-400"
                >
                View Problem
                </button>
            </Link>
            )}
            <div style={{ fontFamily: 'Roboot-Medium' }} className="flex flex-col lg:flex-row space-x-4 space-y-2 flex-wrap">
                
                {
                    solvedProblems.map(problem => (
                        <div className="border border-gray-800 p-4 rounded-lg min-w-[48%] lg:max-w-[48%]">
                            <div className="flex flex-row"> <p>Attempt</p> <p>&nbsp;{attemptCount++}</p></div>
                            <p className="text-2xl">{problem.problem.name}</p>
                            <p className="text-gray-500">{format(new Date(problem.createdAt), 'MMM dd, yyyy • h:mm a')}</p>
                            <p className="text-purple-500">Test Cases Passed: [{problem.numSolved}/6]</p>
                            <br/>
                            <pre className="whitespace-pre-wrap break-words text-xs lg:text-sm">
                                {problem.currentUserCode}
                            </pre>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ProbHistUser;