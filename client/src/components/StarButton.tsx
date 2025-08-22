import { memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFavorite } from "../service";
import FillStar from '../assets/fillStar.svg';
import emptyStar from '../assets/emptyStar.svg';

interface StarButtonProps {
  id: number;
  isFavorite: boolean;
}

export const StarButton: React.FC<StarButtonProps> = memo(({ id, isFavorite }) => {
  const queryClient = useQueryClient();
  // const icon = isFavorite ? "⭐" : "☆";
  const icon = isFavorite ? <img src={FillStar} /> : <img src={emptyStar} />;

  const { mutate: handleFavorite } = useMutation({
    mutationFn: () => updateFavorite(id, isFavorite),
    onSuccess: async () => {
      // Fix: Custom toast can be implemented later
      console.log("Favorite status updated");
      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    onError: () => {
      // Fix: Custom toast can be implemented later
      console.error("Failed to update favorite status");
    },
  });

  return (
    <button
      className="star-button"
      onClick={() => handleFavorite()}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '8px',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f0f0f0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {icon}
    </button>
  );
});
