import React, { useState } from "react";

const SyncDataDaily = ({ onClose }) => {
  const [isSyncing, setSyncing] = useState(false);

  const handleSyncClick = () => {
    setSyncing(true);
    console.log("Syncing daily data via Amazon...");

    const userToken = localStorage.getItem("userToken");
    const url = `https://account.kdp.amazon.com?t=${userToken}`;
    const newWindow = window.open(url, "_blank", "width=800,height=600");

    const currentDate = new Date();
    const options = {
      weekday: "long" as const,
      month: "long" as const,
      day: "numeric" as const,
      hour: "2-digit" as const,
      minute: "2-digit" as const,
    };
    const formattedDate = currentDate.toLocaleString("en-US", options);

    localStorage.setItem("lastSyncDate", formattedDate);

    setTimeout(() => {
      setSyncing(false);
      onClose();
    }, 2000);
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className="sync-data-daily">
      <p className="syncmsg">
        The sales data that you are seeing right now is the old data. Connect
        your Amazon account so you can see the latest sales data.
      </p>
      <button
        className="sync-button"
        onClick={handleSyncClick}
        disabled={isSyncing}
      >
        {isSyncing ? "Syncing..." : "Sync Daily Data via Amazon"}
      </button>
      <span className="close-button" onClick={handleCloseClick}>
        X
      </span>
    </div>
  );
};

export default SyncDataDaily;
