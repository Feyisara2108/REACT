// import { useState, useEffect } from "react";
// import { Card, CardContent } from "../components/ui/card";
// import { Button } from "./ui/button";
// import { Play, Pause } from "lucide-react";

// const MusicApp = () => {
//   const [songs, setSongs] = useState([]);
//   const [currentSong, setCurrentSong] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audio, setAudio] = useState(new Audio());

//   useEffect(() => {
//     fetch("https://musica-api.up.railway.app/songs")
//       .then((res) => res.json())
//       .then((data) => setSongs(data))
//       .catch((error) => console.error("Error fetching songs:", error));
//   }, []);

//   useEffect(() => {
//     audio.addEventListener("ended", () => setIsPlaying(false));
//     return () => {
//       audio.removeEventListener("ended", () => setIsPlaying(false));
//     };
//   }, [audio]);

//   const playSong = (song) => {
//     if (currentSong !== song) {
//       audio.src = song.url;
//       setCurrentSong(song);
//       setIsPlaying(true);
//       audio.play();
//     } else {
//       if (isPlaying) {
//         audio.pause();
//       } else {
//         audio.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <header className="text-center mb-6">
//         <h1 className="text-3xl font-bold">Music Streaming App</h1>
//       </header>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {songs.map((song) => (
//           <Card key={song.id} className="bg-gray-800 shadow-lg">
//             <CardContent className="flex items-center justify-between p-4">
//               <div>
//                 <h2 className="text-lg font-semibold">{song.title}</h2>
//                 <p className="text-sm text-gray-400">{song.artist}</p>
//               </div>
//               <Button onClick={() => playSong(song)} className="bg-blue-500 hover:bg-blue-600">
//                 {currentSong === song && isPlaying ? <Pause /> : <Play />}
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MusicApp;




import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "./ui/button";
import { Play, Pause, AlertCircle } from "lucide-react";

// Create a custom alert component since ui/alert is not available
const Alert = ({ className, children }) => (
  <div className={`p-4 rounded-md border ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children }) => (
  <div className="ml-2 inline-block">{children}</div>
);

// Fallback mock data with reliable audio samples from SoundHelix
// These are royalty-free samples guaranteed to work in browsers
const mockSongs = [
  {
    id: 1,
    title: "Pop Track 1",
    artist: "Similar to Justin Bieber",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Dance Pop Remix",
    artist: "Top Charts Radio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Summer Vibes",
    artist: "Trending Now",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Electric Dreams",
    artist: "Pop Sensation",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "Midnight Feelings",
    artist: "Chart Toppers",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: 6,
    title: "Weekend Playlist",
    artist: "Music Trending",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: 7,
    title: "After Hours",
    artist: "Radio Hits",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: 8,
    title: "Stay (Cover)",
    artist: "Pop Covers",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
];

const MusicApp = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        // Set up an AbortController to handle timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const response = await fetch("https://musica-api.up.railway.app/", {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Invalid data format from API");
        }
        
        setSongs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Couldn't load songs from the server. Using sample songs instead.");
        setSongs(mockSongs);
        setUsingMockData(true);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Set up audio event listeners
  useEffect(() => {
    const handleAudioEnd = () => {
      setIsPlaying(false);
      // Reset the audio when a song ends
      audio.currentTime = 0;
    };
    
    const handleAudioError = () => {
      setIsPlaying(false);
      setAudioLoading(false);
      setError("There was an error playing this track. Please try another song.");
    };
    
    // Add event listeners
    audio.addEventListener("ended", handleAudioEnd);
    audio.addEventListener("error", handleAudioError);
    
    return () => {
      // Clean up
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", handleAudioEnd);
      audio.removeEventListener("error", handleAudioError);
    };
  }, [audio]);

  const playSong = (song) => {
    setAudioLoading(true);
    
    // If trying to play a different song while one is already playing
    if (isPlaying && currentSong && currentSong.id !== song.id) {
      // Stop the current song first
      audio.pause();
      audio.currentTime = 0;
    }

    if (currentSong?.id !== song.id) {
      // Playing a new song
      try {
        audio.src = song.url;
        setCurrentSong(song);
        
        // Use the play promise to handle playback
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setAudioLoading(false);
            setError(null);
          })
          .catch(err => {
            console.error("Error playing audio:", err);
            setError("Couldn't play the song. Please try another track.");
            setIsPlaying(false);
            setAudioLoading(false);
          });
      } catch (err) {
        console.error("Error setting up audio:", err);
        setError("Error setting up the song. Please try another track.");
        setIsPlaying(false);
        setAudioLoading(false);
      }
    } else {
      // Toggle play/pause for the current song
      if (isPlaying) {
        // If playing, pause it
        audio.pause();
        setIsPlaying(false);
        setAudioLoading(false);
      } else {
        // If paused, resume it
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setAudioLoading(false);
            setError(null);
          })
          .catch(err => {
            console.error("Error resuming audio:", err);
            setError("Couldn't resume the song. Try selecting it again.");
            setAudioLoading(false);
          });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Music Streaming App</h1>
        {usingMockData && (
          <p className="text-yellow-400 mt-2">
            Using trending pop music samples (API unavailable)
          </p>
        )}
      </header>
      
      {error && (
        <Alert className="mb-6 bg-yellow-900 border-yellow-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <Card key={song.id} className="bg-gray-800 shadow-lg hover:bg-gray-700 transition-colors">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h2 className="text-lg font-semibold">{song.title}</h2>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
                <Button 
                  onClick={() => playSong(song)} 
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={audioLoading && currentSong?.id !== song.id}
                  aria-label={currentSong?.id === song.id && isPlaying ? "Pause" : "Play"}
                >
                  {currentSong?.id === song.id && audioLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : currentSong?.id === song.id && isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Now Playing indicator */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h3 className="font-medium">Now Playing:</h3>
              <p className="text-sm text-gray-400">{currentSong.title} - {currentSong.artist}</p>
            </div>
            <Button
              onClick={() => {
                if (currentSong) {
                  playSong(currentSong);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicApp;
