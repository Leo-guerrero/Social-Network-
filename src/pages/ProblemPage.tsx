import { faClock, faEye, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faCheck, faCloudArrowUp, faCode, faCodeBranch, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


function ProblemPage(){
    const BackendURL = import.meta.env.VITE_API_URL;

    const ProblemID = useParams();
    
    type Problem = {
        id: number;
        userid: number;
        name: string;
        difficulty: string;
        desc: string;
        startCode: string;
        testCaseCode: string;
        questions: {
            daQuestion: string;
            questionOrder: number;
        }[];
        answers: {
            daAnswer: string;
            answerOrder: number;
        }[];
    }

    const [problem, setProblem] = useState<Problem>();

    const [changeTabs, setChangedTabs] = useState("False");

    document.addEventListener("visibilitychange", function() {
        if(document.visibilityState == "hidden"){
            setChangedTabs("True");
        } else if (document.visibilityState == "visible"){

        }
    });

    var [exactValsReturned, setExactValsReturned] = useState([]);

    const [runetime, setRunTime] = useState<string>("");

    const [showOutput, setShowOutput] = useState(false);

    const [outPut,  setOutPut] = useState("You need to run your code first dummy!");

    //old shit: "\n\tpublic static void main(String[] args){\n\n \t\tSystem.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15},9)));\nSystem.out.println(Arrays.toString(twoSum(new int[]{3,2,4},6)));\nSystem.out.println(Arrays.toString(twoSum(new int[]{3,3},6)));\nSystem.out.println(Arrays.toString(twoSum(new int[]{2,7,9,1},10)));\nSystem.out.println(Arrays.toString(twoSum(new int[]{1,0,20,15,4},19)));\nSystem.out.println(Arrays.toString(twoSum(new int[]{2,5,5,11},10)));\n\t}"
    
    //Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]
    let problemText: string | undefined = ""
    problemText = problem?.desc;
    let startingcode: string | undefined = "";
    startingcode = problem?.startCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t") || "";

    let testCases2: string | undefined = "";
    testCases2 = problem?.testCaseCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t") || "";
    
    
//"public class Solution { \n \n\tpublic static void main(String[] args){\n\n \t\tSystem.out.println(\"Hello World\");\n\t}\n}"
    function WhichDefaultValue(e: String){
        switch(e){
            case "java":
                //setdefaultValue("import java.util.*;\n\npublic class Solution { \n \n\tpublic static int[] twoSum(int[] nums, int target){\n\n \t\treturn new int[1];\n\t}\n}");
                if(problem){
                    setSourceCode(problem.startCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t"));
                }
                break;
            case "python":
                setSourceCode("def main():\n\n\tprint(\"Hello World\")");
                break;
            case "cpp":
                setSourceCode("#include <iostream>\n\nint main() {\n\tstd::cout << \"Hello, World!\" << std::endl;\n\treturn 0;\n}");
                break;
        }
    }

    useEffect(() => {
        fetch(`${BackendURL}/get/specific/Problem/${ProblemID.id}`)
        .then(res => res.json())
        .then(data => {
            setProblem(data);
            setdefaultValue(data.startCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t"));
            console.log("testCaseCode raw:", data.testCaseCode);
            setTestCases(data.testCaseCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t"));
            setSourceCode(data.startCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t"));
            
        })
    },[]);
    

    const Execute_Code = async (language: String, sourceCode: String) => {
        

        console.log("I ran bitch");
        console.log("Im da code bitch: ", sourceCode);
        console.log("Im da language bitch: ", language);

        sourceCode = sourceCode.replace(/}\s*$/,`${testCases}\n`) + "}";
        
        console.log(sourceCode);
        
        const response = await fetch(`${BackendURL}/runCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    language: language,
                    code: sourceCode,
                }),
        });

        const result = await response.json();
        
        
        setOutPut(result.output);
        setRunTime((result.runtime).toFixed(2) + "ms");
        

        console.log("Da output: ", outPut);
        setExactValsReturned(result.output.trim().split(/\r?\n/));

        console.log("Full Piston response:", result);

        if(exactValsReturned[0] == "[0, 1]" && exactValsReturned[1] == "[1, 2]" && exactValsReturned[2] == "[0, 1]" && exactValsReturned[3] == "[2, 3]" && exactValsReturned[4] == "[3, 4]" && exactValsReturned[5] == "[1, 2]"){
            const btn = document.getElementById("CodeSubmit") as HTMLButtonElement;
            btn.disabled = false;
        } 
        
    }
    //"\n\tpublic static void main(String[] args){\n\n \t\tSystem.out.println(\"you done goofed\");}"
    const [language, setlanguage] = useState("java");
    const [testCases, setTestCases] = useState("");
    //"import java.util.*;\n\npublic class Solution { \n \n\tpublic static int[] twoSum(int[] nums, int target){\n\n \t\treturn new int[1];\n\t}\n}"
    const [defaultValue, setdefaultValue] = useState<string>("");
    const [sourceCode, setSourceCode] = useState(defaultValue);

    

    return (

        <>
        <br/>
        <br/>
        <div className="flex flex-col md:flex-row p-6 space-x-2 space-y-4 md:space-y-0 justify-center" style={{ fontFamily: 'Roboot-Medium' }}>
            
            <div className="border border-gray-800 p-6 rounded-xl space-y-4 md:w-1/2">
            <div style={{ fontFamily: 'Roboot-bold' }} className="flex flex-row items-center space-x-6 text-2xl">
                    <Link to="/Program"><FontAwesomeIcon icon={faArrowLeft} /></Link>
                    <p>back</p>
                </div>
                <p className="text-2xl">{problem?.id}. {problem?.name}</p>
                <p className="bg-gray-800 rounded-full p-2 w-fit text-sm">{problem?.difficulty}</p>
                <p>
                    {problemText?.replace(/\\n/g, "\n").split("\n").map((line, i) =>
                    <span key={i}>
                        {line}
                        <br/>
                    </span>
                    )}
                   
                </p>
            </div>

            <div className="flex flex-col md:w-1/2 space-y-4">
                <div className="space-y-4 border border-gray-800 p-6 rounded-xl">
                    <p className="text-2xl"><FontAwesomeIcon icon={faCode} /> Code</p>
                    <div className="flex flex-row items-center space-x-8"> 
                        <select name="languages" className="bg-black p-2 focus:bg-purple-500" onChange={(e) => {setlanguage(e.target.value);  WhichDefaultValue(e.target.value);}}>
                            <option value="java" className="focus:bg-indigo-500">Java</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                        </select>

                        <button onClick={() => Execute_Code(language, sourceCode)} className="hover:text-green-400 px-2"><FontAwesomeIcon icon={faPlay} /></button>
                    </div>
                    <div className='rounded-xl z-0 bg-black'><Editor height="50vh" width="45vw" language={language} value={sourceCode} theme='hc-black' options={{fontSize: 15}} onChange={(value) => setSourceCode(value || "")}/></div>
                </div>

                <div className="border border-gray-800 p-6 rounded-xl">
                    <div className="flex flex-row space-x-2">
                        <button onClick={() => setShowOutput(false)} className={`${!showOutput ? "bg-gray-700 border border-gray-800 px-3 rounded-md": "hover:bg-gray-800 border border-gray-800 px-3 rounded-md"}`}><p className="text-lg"><FontAwesomeIcon icon={faSquareCheck} /> Test Cases</p></button>
                        <button onClick={() => setShowOutput(true)} className={`${showOutput ? "bg-gray-700 border border-gray-800 px-3 rounded-md": "hover:bg-gray-800 border border-gray-800 px-3 rounded-md"}`}><p className="text-lg"><FontAwesomeIcon icon={faCodeBranch} /> Output</p></button>
                    </div>
                    <br/>
                    {showOutput ? <p className={`${outPut == "You need to run your code first dummy!" ? "text-gray-700" : "text-white"}`}>{outPut} </p>
                    : 
                    <>
                    <div className="flex flex-col lg:flex-row space-x-12 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <p className={`${exactValsReturned[0] == (problem?.answers.find(a => a.answerOrder == 0))?.daAnswer ? "text-green-500" : exactValsReturned[0] == null ? "text-white" : "text-red-500"}`}>{(problem?.questions.find(a => a.questionOrder == 0))?.daQuestion} {exactValsReturned[0] == (problem?.answers.find(a => a.answerOrder == 0))?.daAnswer ? <p><FontAwesomeIcon icon={faCheck} /> Passed</p> : exactValsReturned[0] == null ? <p></p> : <p><FontAwesomeIcon icon={faXmark} /> Failed</p>}</p>
                            <p className={`${exactValsReturned[1] == (problem?.answers.find(a => a.answerOrder == 1))?.daAnswer ? "text-green-500" : exactValsReturned[1] == null ? "text-white" : "text-red-500"}`}>{(problem?.questions.find(a => a.questionOrder == 1))?.daQuestion} {exactValsReturned[1] == (problem?.answers.find(a => a.answerOrder == 1))?.daAnswer ? <p><FontAwesomeIcon icon={faCheck} /> Passed</p> : exactValsReturned[1] == null ? <p></p> : <p><FontAwesomeIcon icon={faXmark} /> Failed</p>}</p>
                            <p className={`${exactValsReturned[2] == (problem?.answers.find(a => a.answerOrder == 2))?.daAnswer ? "text-green-500" : exactValsReturned[2] == null ? "text-white" : "text-red-500"}`}>{(problem?.questions.find(a => a.questionOrder == 2))?.daQuestion} {exactValsReturned[2] == (problem?.answers.find(a => a.answerOrder == 2))?.daAnswer ? <p><FontAwesomeIcon icon={faCheck} /> Passed</p> : exactValsReturned[2] == null ? <p></p> : <p><FontAwesomeIcon icon={faXmark} /> Failed</p>}</p>
                        </div> 

                        <div className="flex flex-col space-y-2">
                            <p className={`${exactValsReturned[3] == (problem?.answers.find(a => a.answerOrder == 3))?.daAnswer ? "text-green-500" : exactValsReturned[3] == null ? "text-white" : "text-red-500"}`}>Secret Test Case: 1 {exactValsReturned[3] == (problem?.answers.find(a => a.answerOrder == 3))?.daAnswer ? <p><FontAwesomeIcon icon={faCheck} /> Passed</p> : exactValsReturned[3] == null ? <p></p> : <p><FontAwesomeIcon icon={faXmark} /> Failed</p>}</p>
                            <p className={`${exactValsReturned[4] == (problem?.answers.find(a => a.answerOrder == 4))?.daAnswer ? "text-green-500" : exactValsReturned[4] == null ? "text-white" : "text-red-500"}`}>Secret Test Case: 2 {exactValsReturned[4] == (problem?.answers.find(a => a.answerOrder == 4))?.daAnswer ? <p><FontAwesomeIcon icon={faCheck} /> Passed</p> : exactValsReturned[4] == null ? <p></p> : <p><FontAwesomeIcon icon={faXmark} /> Failed</p>}</p>
                            <p className={`${exactValsReturned[5] == (problem?.answers.find(a => a.answerOrder == 5))?.daAnswer ? "text-green-500" : exactValsReturned[5] == null ? "text-white" : "text-red-500"}`}>Secret Test Case: 3{exactValsReturned[5] == (problem?.answers.find(a => a.answerOrder == 5))?.daAnswer ? <p><FontAwesomeIcon icon={faCheck} /> Passed</p> : exactValsReturned[5] == null ? <p></p> : <p><FontAwesomeIcon icon={faXmark} /> Failed</p>}</p>
                        </div>
                    </div>
                    <p className={`${changeTabs == "True" ? "text-red-500" : "text-white"}`}><FontAwesomeIcon icon={faEye} /> Changed Tabs?: {changeTabs}</p>
                    <p className="pb-4"><FontAwesomeIcon icon={faClock} /> Runtime: {runetime}</p>
                    <button id='CodeSubmit' className="p-2 bg-purple-500 rounded-lg text-lg hover:bg-purple-400 disabled:bg-gray-800"><FontAwesomeIcon icon={faCloudArrowUp} /> Submit</button>
                    </>
                    }

                </div>
            </div>
        </div>
        </>
    );
}

export default ProblemPage;