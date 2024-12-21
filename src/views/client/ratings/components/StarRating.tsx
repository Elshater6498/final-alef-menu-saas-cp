import React from 'react'
import { FaStar } from 'react-icons/fa'

interface StarRatingProps {
    rating: number
    size?: number
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    size = 16,
}) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                    key={star}
                    size={size}
                    className={`${
                        star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                    }`}
                />
            ))}
        </div>
    )
}
