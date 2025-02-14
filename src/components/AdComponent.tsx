import React, { useEffect } from "react";

const AdComponent = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }
  }, []);

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3940256099942544" // Use test AdSense Client ID for localhost
        data-ad-slot="1234567890" // Replace with a valid slot ID
        data-ad-format="auto"
      ></ins>
    </div>
  );
};

export default AdComponent;
