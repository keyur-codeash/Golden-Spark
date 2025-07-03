import React from "react";

const Map = () => {
  return (
    <div className="map">
      <div className="container mx-auto">
        <div className="px-4 lg:px-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.4403905584545!2d72.83725217573982!3d21.214378381376378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f512c17f8a3%3A0xe3dc01498584ea95!2sCodeash%20Infotech!5e0!3m2!1sen!2sin!4v1747389077408!5m2!1sen!2sin"
          className="w-full h-[400px] xl:h-[600px] rounded-sm"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        </div>
      </div>
    </div>
  );
};

export default Map;
