import React, { useEffect, useState } from "react";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

const keyPairReduction = [
    'uri',
    'track_href',
    'analysis_url',
    'mode',
    'valence'
];


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

                const audioFeaturesData = [];
                for (let i = 0; i < trackIds.length; i ++) {
                    const audioFeatureResponses = await fetch(`https://api.spotify.com/v1/audio-features/${trackIds[i]}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }).then((response) => {
                            if (!response.ok) {
                                console.log(response.json());
                                throw new Error("Failed to fetch audio features");
                            }
                            return response.json();
                        }).catch(e=>{
                            console.log(e);
                        })                         
                    console.warn(audioFeatureResponses);
                    audioFeaturesData.push(audioFeatureResponses);
                    await sleep(300);
                }
                
                keyPairReduction.forEach(key => {
                    audioFeaturesData.forEach(el=> {
                        delete el[key]
                    });
                })
                setAudioFeatures(audioFeaturesData);
                fetch(`http://127.0.0.1:5000/save`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(audioFeaturesData)
                }).then(res=>{console.log(res)});
            } catch (error) {
                console.error("Error fetching playlist tracks:", error);
            }
        };

        fetchPlaylistTracks();
    }, [token]);
  /// TODO: Parse the json object into csv file 

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
