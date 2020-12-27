import Link from 'next/link'
import React, { useState, useEffect } from "react";
import { Form, Spinner, Jumbotron, Row, Col, 
    Modal, Button, Container, Image } from "react-bootstrap";
import { FaGithub } from "react-icons/fa";
import CreatableSelect from "react-select/creatable";
import axios from "../../util/axios";
import { useAuth } from "../../context/auth";

import Interests from "../../components/Profile/Interests";
import Footer from "../../components/Footer/Footer";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import options from "../../components/Profile/SkillOptions";

import { useRouter } from 'next/router'


const Post = () => {

  return <p>Post: {pid}</p>
}

function Profile() {
	const router = useRouter()
	const { username } = router.query
	console.log('fdssss',username)


	const { firebaseUser, token, loading } = useAuth();
	const [userRequest, setUserRequest] = useState({ loading: false });
	const [editDialog, setEdit] = useState({ show: false, closable: true });
	const editProfile = () => setEdit({ show: true, closable: true });
	const handleClose = () => setEdit({ show: false, closable: false });
	
	useEffect(() => {
		if (token) {
			setUserRequest({ loading: true });
			axios.defaults.headers.common['Authorization'] = `Token ${token}`;
			axios.get(`profile/${username}`).then((res) => {
				setUserRequest({
					loading: false,
					user: res.data,
				});
				const arr = [
					res.data.name,
					res.data.username,
					res.data.interests,
					res.data.bio,
					res.data.github_handle,
				];
				// Check for null fields
				if (!arr.every((elm) => elm !== '' && elm !== null)) {
					setEdit({
						show: true,
						closable: false,
					});
				}
			}).catch((err)=> {console.log('rsdf',err)});
		}
	}, [token]);

	const url = firebaseUser !== null ? firebaseUser.photoURL : '';
	if (loading || userRequest.loading)
		return (
			<Container className="text-center">
				<Spinner
					style={{
						position: 'absolute',
						top: '50%',
					}}
					className="mt-auto mb-auto"
					animation="border"
					role="status"
				>
					<span className="sr-only">Loading...</span>
				</Spinner>
			</Container>
		);
	else if (!firebaseUser || !userRequest.user) {
		return (
			<Container className="text-center">
				Please Login to View this Page
			</Container>
		);
	}
	return (
		<div>

			<Jumbotron
				style={{
					background: 'url("../images/profile_cover.jpg") no-repeat',
					backgroundSize: 'cover',
				}}
				className="text-white"
			>
				<Container>
					<Row>
						<Col md={4} className="text-center pt-sm-3">
							<Image
								src={url}
								fluid
								style={{
									boxShadow: '1px 1px 40px 1px black',
									border: '2px solid white',
									'border radius': 50,
									width: 200,
									height: 200,
								}}
								roundedCircle
							/>
							<p className="h4 p-sm-3">
								{userRequest.user.username}
							</p>
						</Col>
						<Col md={8}>
							<div
								style={{ height: 20 }}
								className="d-sm-block d-none"
							/>
							<h2 style={{ color: 'white' }}>
								{userRequest.user.name}
							</h2>
							<Row>
								<div className="col-6">
									{'IIT (BHU) Varanasi'}
								</div>
								{userRequest.user.github_handle && (
									<a
										href={`https://github.com/${userRequest.user.github_handle}`}
										className="col-6 text-white text-right"
									>
										<FaGithub />{' '}
										{userRequest.user.github_handle}
									</a>
								)}
							</Row>
							<br />
							<h5 className="text-white">About Me</h5>
							<hr style={{ borderColor: 'white' }} />
							<p className="text-break">{userRequest.user.bio}</p>
							
						</Col>
					</Row>
				</Container>
			</Jumbotron>
			<div className="container">
				<Interests interests={userRequest.user.interests} />
				<ProfileTabs teams={userRequest.user.teams} />
			</div>
			<Footer />
		</div>
	);
}

export default Profile;