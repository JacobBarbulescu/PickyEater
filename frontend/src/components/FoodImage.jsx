//Image component that replaces the image if src fails
import notFound from "../assets/Empty-Plate.webp";

function FoodImage({ src, alt, ...props }) {
    return (
        <img src={src} alt={alt} onError={(e) => { e.target.onerror = null; e.target.src = notFound; }} {...props} />
    )
}

export default FoodImage;