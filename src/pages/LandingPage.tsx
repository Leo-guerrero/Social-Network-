import { Link } from "react-router-dom";
import { FloatingGraphBackground } from "../components/FloatingGraphBackground";

function LandingPage(){
    console.log("Local Storage: ", localStorage.getItem('currentUser'))
    const currentUser = localStorage.getItem('currentUser')
    return (
        <div className="flex gap-4">
            <div className="p-20 space-y-8 w-1/2">
                <div style={{ fontFamily: 'Roboot-Medium' }} className="text-5xl md:text-7xl lg:text-7xl xl:text-7xl space-y-2">
                    <div>Connect.</div>
                    <div className="text-purple-500">&lt;Code.&nbsp;/&gt;</div>
                    <div>Collaborate.</div>
                </div>

                <div style={{ fontFamily: 'Roboot-light' }} className="text-md md:text-xl">Welcome to the hub for developers who dream bigger. Whether you're sharing your latest project, looking for feedback, or building your network, this is where programmers come together to grow. </div>
                {/* <-- Conditional link here */}
                <div>
                    <Link to={currentUser ? "/MainFeed" : "/Login"}>
                        <button
                            style={{ fontFamily: 'Roboot-light' }}
                            className="text-md border border-white p-4 hover:bg-purple-500 hover:border-purple-500"
                        >
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
            <div className="p-20 space-y-8 w-1/2">
                <FloatingGraphBackground />
            </div>
        </div>
    )

}


export default LandingPage;