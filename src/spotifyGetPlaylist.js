import React, { useEffect, useState } from "react";

const Playlist = ({ token }) => {
	const [tracks, setTracks] = useState([]);

	useEffect(() => {
		console.log("token", token);
		const fetchPlaylistTracks = async () => {
			fetch(
				"https://api.spotify.com/v1/playlists/3tK5Fh5GF92ehN8N2L0EYW/tracks",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Failed to fetch playlist tracks");
					}
					return response.json();
				})
				.then((data) => setTracks(data.items))
				.catch((error) =>
					console.error("Error fetching playlist tracks:", error),
				);
		};

		fetchPlaylistTracks();
	}, [token]);

	return (
		<div>
			<h1>Playlist Tracks</h1>
			<ul>
				{tracks.map((track) => (
					<li key={track.track.id}>{track.track.name}</li>
				))}
			</ul>
		</div>
	);
};

export default Playlist;
