import { ClassAttributes, Props, PropsWithoutRef, useEffect, useState } from "react";

import { api } from "../services/api";
import { Button } from "./Button";

import '../styles/sidebar.scss';


interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface SideBarProps {
  updateSelectedGenre: (arg: GenreResponseProps) => void;
  updateMovies: (arg: MovieProps[])=>void;
}


export const SideBar: React.FC<SideBarProps> = ({updateSelectedGenre, updateMovies}) => {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({id: 1, name: "action", title: "Ação"});
  
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);


  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);
  
  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      updateMovies(response.data);
    });
    
    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
      updateSelectedGenre(response.data);
    })
  }, [selectedGenreId]);
  
  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }
  
  
  return (
    <nav className="sidebar">
      <span>Watch<p>Me</p></span>

      <div className="buttons-container">
        {genres.map(genre => (
          <Button
            key={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => handleClickButton(genre.id)}
            selected={selectedGenreId === genre.id}
          />
        ))}
      </div>

    </nav>
  )

}