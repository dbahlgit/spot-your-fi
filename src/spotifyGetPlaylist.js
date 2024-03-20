import React, { useEffect, useState } from "react";

const Playlist = ({ token }) => {
    const [tracks, setTracks] = useState([]);
    const [audioFeatures, setAudioFeatures] = useState([]);

    useEffect(() => {
        const fetchPlaylistTracks = async () => {
            try {
                const response = await fetch(
                    "https://api.spotify.com/v1/playlists/3tK5Fh5GF92ehN8N2L0EYW/tracks",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch playlist tracks");
                }

                const data = await response.json();
                setTracks(data.items);
                
                // track IDs
                const trackIds = data.items.map((item) => item.track.id);

                
                const batchSize = 50;
                const audioFeaturesData = [];
                for (let i = 0; i < trackIds.length; i += batchSize) {
                    const batchIds = trackIds.slice(i, i + batchSize);
                    const audioFeatureResponses = await Promise.all(
                        batchIds.map((id) =>
                            fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }).then((response) => {
                                if (!response.ok) {
                                    throw new Error("Failed to fetch audio features");
                                }
                                return response.json();
                            })
                        )
                    );
                    audioFeaturesData.push(...audioFeatureResponses);
                }
                
                
                setAudioFeatures(audioFeaturesData);
                
                // Serialize audio features data to JSON
                const json = JSON.stringify(audioFeaturesData);
                console.log(json); // Consoling the data right now! 
            } catch (error) {
                console.error("Error fetching playlist tracks:", error);
            }
        };

        fetchPlaylistTracks();
    }, [token]);

    return (
        <div>
            <h1>Playlist Tracks</h1>
            <ul>
                {tracks.map((track, index) => (
                    <li key={track.track.id}>
                        <span>{track.track.name}</span>
                        <span style={{ marginLeft: "10px" }}>ID: {track.track.id}</span>
                        
                        {audioFeatures[index] && (
                            <div>
                                <p>Audio Features:</p>
                                <pre>{JSON.stringify(audioFeatures[index], null, 2)}</pre>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Playlist;
