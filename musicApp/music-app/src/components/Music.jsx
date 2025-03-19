import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "./ui/button";
import { Play, Pause } from "lucide-react";

const MusicApp = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(new Audio());

  useEffect(() => {
    fetch("https://musica-api.up.railway.app/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  useEffect(() => {
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [audio]);

  const playSong = (song) => {
    if (currentSong !== song) {
      audio.src = song.url;
      setCurrentSong(song);
      setIsPlaying(true);
      audio.play();
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Music Streaming App</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <Card key={song.id} className="bg-gray-800 shadow-lg">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-lg font-semibold">{song.title}</h2>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
              <Button onClick={() => playSong(song)} className="bg-blue-500 hover:bg-blue-600">
                {currentSong === song && isPlaying ? <Pause /> : <Play />}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MusicApp;
