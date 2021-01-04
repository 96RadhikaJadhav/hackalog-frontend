import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from "../../util/axios";
import { useAuth } from "../../context/auth";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Date from "../../components/Date/Date";
import { useRouter } from 'next/router';
import {
	Button, Spinner, Jumbotron,
	Row, Col, Container, Image,
} from "react-bootstrap";

export default function Hackathon() {
    const { firebaseUser, token, loading } = useAuth();
    console.log(token);
    const [hackathon, setHackathon] = useState([]);
    const [id, setId] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [activeTab, setActiveTab] = useState([]);
    const [topSubmissions, setTopSubmissions] = useState([]);
    const [allSubmissions, setAllSubmissions]  = useState([]);
    const router = useRouter();
    const {slug} = router.query;
    useEffect(
        () => {
            if (slug) {
            console.log(slug);
            axios.get(`/hackathon/${slug}/`)
            .then(
                (response) => {
                
                setHackathon(response.data);
                setId(response.data.id);
                console.log(response.data.id);
                
                axios.get(`/hackathons/${response.data.id}/submissions/`).then(
                    (submissions) => {
                    setTopSubmissions(submissions.data.sort((a,b) => b.score >  a.score? 1: -1).slice (0,10));
                    setAllSubmissions(submissions.data);
                    
                    }
                ).catch(
                    (err) => null 
                )
                }
            ).catch(
                (err) => null
            )
            }
        }, [slug]
    );
    

    //logged in - OVER (submission) NOT OVER (your submission) NOT STARTED (participants)
    //logged out - OVER(submissions) NOT OVER(nothing) NOT STARTED(nothing)

        let component;
        let tab_name;
        if (hackathon.status == "Completed") {
            tab_name = "All submissions"
            if (allSubmissions.length == 0) {
                component = <div> No submissions yet </div>
            }
            else { 
                component = <AllSubmissions submissions = {allSubmissions}/>
            }           
        } else if(hackathon.status == "Ongoing" && token) {
            tab_name = "Your submissions"
            if (allSubmissions.length == 0) {
                component = <div> No submissions yet </div>
            }
            else { 
                component = <AllSubmissions submissions = {allSubmissions}/>
            }     
        } else if (hackathon.status == 'Upcoming' && token){
            tab_name = "Participants"
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;
            axios
            .get(`/hackathons/${id}/teams/`)
            .then((teams) => setParticipants(teams.data))
            .catch((err) => null)  
            component = <Participants participants = {participants}/>
        } else {
            tab_name = "Partcipants"
            component = <div> Please login to view</div>
        }

                  
    return(
        <div>
            <div className="banner-section" style = {{background :`url(${hackathon.image})`}}>
                <div> 
                </div>
            </div>
            <div className = "body ">
                <div className = "tabs">
                
                <Tabs defaultActiveKey="overview" >
                        <Tab title ="  "></Tab>
                        <Tab eventKey= "overview" title='Overview'>
                        <div className =" tabContent">
                        <Overview hackathon = {hackathon}/>
                        </div>
                        </Tab>
                        <Tab eventKey= "participants" title = {tab_name}>
                            <div className =" tabContent">
                            {component}
                            </div>
                        </Tab>
                        <Tab eventKey = "leaderboard" title = "Leaderboard">
                            <div className =" tabContent">
                            { (topSubmissions.length == 0) ?( <div> No submissions yet </div> ):( <Leaderboard submissions = {topSubmissions}/>)} 
                            </div>
                        </Tab>
                </Tabs>
                </div>
                <div >
                <div className="container py-3 py-md-5">
                    <div className="row no-gutters">
                        <div className="col-12 col-lg-4 order-1 order-lg-2 ">
                            <div className="pb-5 pb-lg-0 ">
                                <div className="bg-grey p-3 p-md-4 wid" >
                                    <div className="pb-3">Join to receive hackathon updates, find teammates, and submit a project.
                                    </div>
                                    <div>
                                        <div className="btn btn-success w-100">Join Hackathon</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div> 
                </div>
            </div>
            
            <style jsx>{`
                .banner-section {
                    min-height: 350px;
                    width: 100%;
                    background: linear-gradient(to top left, #2986a5,#0d6697,#00879a,#00776b);
                }
                
               .body {
                   display: flex;
               }
               .tabs {
                   width: 100vw;
                    height: 10vh;
                   
               }
               .wid {
                   width: 30vw;
               }
               .menu-item {
                    
                    color: rgba(0,0,0,0.7);
                }
                .menu-item:hover {
                    color: black;
                }
                .bg-grey {
                    background-color: rgba(0,0,0,0.04);
                }
            `}</style>
        </div>
    )
}

function Loading() {
    return (
        <Container className="text-center">
				<Spinner
					style={{
						position: "absolute",
						top: "50%",
					}}
					className="mt-auto mb-auto"
					animation="border"
					role="status"
				>
					<span className="sr-only">Loading...</span>
				</Spinner>
		</Container>
    )

}
function Overview( {hackathon} )  {
    return (
        <div className = "overview_body">
            <div className="p-3">
                    <h1 className=" title"> {hackathon.title} </h1>
                    <p className="pt-3">
                        {hackathon.description}
                    </p>
                    <p className="pt-3">
                        <h6> START DATE: </h6> 9th December
                    </p>
                    <p className="pt-3">
                        <h6>END DATE:</h6> 10th December 
                    </p>
                    <p className="pt-3">
                        <h6> STATUS:</h6> {hackathon.status}
                    </p>
                    <p className="pt-3">
                        <h6> RESULTS DECLARED: </h6> {hackathon.results_declared ? "Yes" : "No"}
                    </p>
                    <p className="pt-3">
                        <h6> MAXIMUM TEAM SIZE:</h6> {hackathon.max_team_size}
                    </p>
            </div>
            <style jsx>{`
                .p3 {
                    margin-left: 50px;
                }
                .overview_body {
                    margin-left: 50px;
                }
                .title {
                    font-size : 30px;
                    padding-bottom : 30px;
                    padding-top: 30px;
                }                        
           `}</style>                
        </div>
    )
}

function Participants({participants}) {
    return (
        <div >
           { participants.map( (team, index) => team.name.indexOf('Team Ongoing') == -1 ?
            ( <div className = "bg-grey"><h6>{index}. {team.name}</h6> 
             <style jsx>{`
             .bg-grey {
                 background-color: rgba(0.9,0,0,0.04);
                 height: 7vh;
                 margin-left: 50px;
                 margin-bottom: 4px;
                 padding: 10px;    
             }
             `}</style></div> ) : <ol> </ol>
            )}
        </div>
    )
}

function Leaderboard({submissions}) {
        return (
        <div>
            <div className = "bg-grey heading"> 
                <div className = "rank"> <h6>RANK</h6> </div>
                <div className = "team"> <h6>TEAM NAME</h6> </div>
                <div className = "score"> <h6>SCORE</h6> </div>
            </div>
        
            { submissions.map( (submission,index) => 
                    <div className = "bg-grey">
                        <div className = "rank"> {index + 1}.</div>
                        <div className = "team"> {submission.team} </div>
                        <div className = "score"> {submission.score} </div>
                    </div>
            )} 

           <style jsx>{`
                .rank {
                    width: 10vw;
                }
                .team {
                    width:20vw;
                }
                .score {
                    width: 10vw;
                }
                .bg-grey {
                 background-color: rgba(0.9,0,0,0.04);
                 display : flex;
                 height: 7vh;
                 margin-left: 50px;
                 margin-bottom: 4px;
                 margin-top: 4px;
                 color: rgba(0.9,0,0,0.8);
                 padding: 10px;
                }
                .heading {
                 color: black
                }
            `}</style>
        </div>
        )
}


function AllSubmissions({submissions}) {
        console.log(submissions.length);
        return (
        <div>
            <div className = "bg-grey heading"> 
                <div className = "rank"> <h6>Sl. No.</h6> </div>
                <div className = "team"> <h6>TEAM NAME</h6> </div>
            </div>
        
            { submissions.map( (submission,index) => 
                    <div className = "bg-grey">
                        <div className = "rank"> {index + 1}.</div>
                        <div className = "team"> {submission.team} </div>
                    </div>
            )}
           <style jsx>{`
                .rank {
                    width: 20vw;
                }
                .team {
                    width:30vw;
                }
                .bg-grey {
                 background-color: rgba(0.9,0,0,0.04);
                 display : flex;
                 height: 7vh;
                 margin-left: 50px;
                 margin-bottom: 4px;
                 margin-top: 4px;
                 color: rgba(0.9,0,0,0.8);
                 padding: 10px;
                }
                .heading {
                 color: black
                }
            `}</style>
        </div>
        )
}

