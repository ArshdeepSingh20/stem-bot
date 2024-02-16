import React, { useState } from "react";

function UploadImage({ generateImageCaption, setModalOpen }) {
  const [image, setImage] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImage(reader.result);

        // Call generateImageCaption function
        await generateImageCaption(file);

        // Close the modal after successful upload
        setModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImage(reader.result);
        // Call generateImageCaption function
        await generateImageCaption(file);

        // Close the modal after successful upload
        setModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div
          className={`d-flex flex-column align-items-center p-5`}
          style={{ textAlign: "center", cursor: "pointer" }}
        >
          <img
            style={{ maxWidth: "100px" }}
            src="/images/sampleimage.png"
            alt=""
          />
          <p className="mt-5">
            {" "}
            Drag here or
            <span
              style={{ color: "#0586EC", borderBottom: "1px solid #0586EC" }}
            >
              {" "}
              upload image
            </span>
          </p>
        </div>
      </label>
      {/* {image && (
        <img
          src={image}
          alt="Uploaded"
          style={{ maxWidth: "100%", marginTop: "20px" }}
        />
      )} */}
    </div>
  );
}

export default UploadImage;
