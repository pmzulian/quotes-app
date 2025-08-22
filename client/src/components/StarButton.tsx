import { memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFavorite } from "../service";
import { Button, message } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";

interface StarButtonProps {
  id: number;
  isFavorite: boolean;
}

export const StarButton: React.FC<StarButtonProps> = memo(({ id, isFavorite }) => {
  const queryClient = useQueryClient();
  const icon = isFavorite ? <StarFilled /> : <StarOutlined />;

  const { mutate: handleFavorite } = useMutation({
    mutationFn: () => updateFavorite(id, isFavorite),
    onSuccess: async () => {
      message.success("Favorite status updated");
      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    onError: () => {
      message.error("Failed to update favorite status");
    },
  });

  return (
    <Button
      icon={icon}
      onClick={() => handleFavorite()}
    />
  );
}
);
