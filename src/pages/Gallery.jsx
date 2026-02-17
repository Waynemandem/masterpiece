function Gallery() {
    const images = [
        "./images/photo_2026-02-16_06-17-24.jpg",
        "./images/photo_2026-02-16_06-17-25.jpg",
        "./images/photo_2026-02-16_06-17-24.jpg",
        "./images/photo_2026-02-16_06-17-24 copy.jpg"
    ]
    return(
        <div className="gallery-page">
           <h2>Gallery</h2>

           <div className="gallery-grid">
            {images.map((index, img) => (
                <img key={index} src={img} alt="Sharwama" />
            ))}
           </div>
        </div>
    )
}



export default Gallery;