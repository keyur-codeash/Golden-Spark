"use client";

import { useEffect } from "react";

export default function InstagramImage({ postUrl }) {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up everything except the image
    const keepOnlyImage = () => {
      document.querySelectorAll("blockquote.instagram-media").forEach((bq) => {
        const imgs = bq.querySelectorAll("img");
        if (imgs.length) {
          const wrapper = document.createElement("a");
          wrapper.href = postUrl;
          wrapper.target = "_blank";
          wrapper.rel = "noopener noreferrer";
          wrapper.className = "insta-only-wrapper";
          imgs.forEach((img) => wrapper.appendChild(img.cloneNode(true)));
          bq.parentNode.replaceChild(wrapper, bq);
        }
      });
    };

    // Run a few times (Instagram loads asynchronously)
    const timers = [800, 1500, 3000].map((delay) =>
      setTimeout(keepOnlyImage, delay)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [postUrl]);

  return (
    <>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{ background: "transparent", border: 0, padding: 0 }}
      ></blockquote>

      <style jsx>{`
        .insta-only-wrapper img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          border-radius: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .insta-only-wrapper img:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
        }
      `}
      </style>
    </>
  );
}


// "use client";
// import React, { useEffect } from "react";

// const InstagramEmbed = ({ postUrl }) => {
//   useEffect(() => {
//     if (!window.instgrm) {
//       const script = document.createElement("script");
//       script.src = "https://www.instagram.com/embed.js";
//       script.async = true;
//       script.onload = () => window.instgrm.Embeds.process();
//       document.body.appendChild(script);
//     } else {
//       window.instgrm.Embeds.process();
//     }
//   }, [postUrl]);

//   return (
//     <blockquote
//       className="instagram-media"
//       data-instgrm-permalink={postUrl}
//       data-instgrm-version="14"
//       style={{
//         background: "#FFF",
//         border: 0,
//         borderRadius: "10px",
//         boxShadow: "0 0 5px rgba(0,0,0,0.1)",
//         margin: "1rem auto",
//         maxWidth: "540px",
//         minWidth: "326px",
//       }}
//     ></blockquote>
//   );
// };

// export default InstagramEmbed;
