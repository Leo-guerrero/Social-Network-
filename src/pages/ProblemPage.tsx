import { faCode, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Editor from '@monaco-editor/react';
import { useState } from 'react';


function ProblemPage(){

    function WhichDefaultValue(e: String){
        switch(e){
            case "java":
                setdefaultValue("public static void main(String[] args){\n\n \tSystem.out.println(\"Hello World\");\n}");
                break;
            case "python":
                setdefaultValue("def main():\n\n\tprint(\"Hello World\")");
                break;
            case "cpp":
                setdefaultValue("#include <iostream>\n\nint main() {\n\tstd::cout << \"Hello, World!\" << std::endl;\n\treturn 0;\n}");
                break;
        }
    }

    function Execute_Code(language: String, sourceCode: String){
        console.log("The source code: ", sourceCode);
        console.log("Da friggin language yo: ", language);
    }

    const [language, setlanguage] = useState("java");
    const [defaultValue, setdefaultValue] = useState("public static void main(String[] args){\n\n \tSystem.out.println(\"Hello World\");\n}");
    const [sourceCode, setSourceCode] = useState(defaultValue);

    return (

        <>
        <br/>
        <br/>
        <div className="flex flex-col md:flex-row p-6 space-x-2 space-y-4 md:space-y-0 justify-center" style={{ fontFamily: 'Roboot-Medium' }}>
            
            <div className="border border-gray-800 p-6 rounded-xl space-y-4 md:w-1/2">
                <p className="text-2xl">1. Two Sum</p>
                <p className="bg-gray-800 rounded-full p-2 w-fit text-sm">Easy</p>
                <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. 
                    You may assume that each input would have exactly one solution, and you may not use the same element twice. 
                    You can return the answer in any order.

                    <br/>
                    <br/>
                    Example 1:<br/>

                    Input: nums = [2,7,11,15], target = 9<br/>
                    Output: [0,1]<br/>
                    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].<br/>
                    <br/>
                    Example 2:<br/>

                    Input: nums = [3,2,4], target = 6<br/>
                    Output: [1,2]<br/><br/>
                    Example 3:<br/>

                    Input: nums = [3,3], target = 6<br/>
                    Output: [0,1]<br/>
                </p>
            </div>

            <div className="flex flex-col md:w-1/2 space-y-4">
                <div className="space-y-4 border border-gray-800 p-6 rounded-xl">
                    <p className="text-2xl"><FontAwesomeIcon icon={faCode} /> Code</p>
                    <div className="flex flex-row items-center space-x-8"> 
                        <select name="languages" className="bg-black p-2 focus:bg-purple-500" onChange={(e) => {setlanguage(e.target.value);  WhichDefaultValue(e.target.value); setSourceCode(defaultValue);}}>
                            <option value="java" className="focus:bg-indigo-500">Java</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                        </select>

                        <button onClick={() => Execute_Code(language, sourceCode)} className="hover:text-green-400 px-2"><FontAwesomeIcon icon={faPlay} /></button>
                    </div>
                    <div className='rounded-xl z-0 bg-black'><Editor height="50vh" width="45vw" language={language} value={defaultValue} theme='hc-black' options={{fontSize: 15}} onChange={(value) => setSourceCode(value || "")}/></div>
                </div>

                <div className="border border-gray-800 p-6 rounded-xl">
                    <p className="text-lg">Output</p>
                    <p className="text-gray-700">You need to run your code first dummy!</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default ProblemPage;