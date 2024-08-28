import { onValue, ref } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { database } from "../misc/firebase";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [allRooms, setAllRooms] = useState("");

  useEffect(() => {
    let roomsRef = ref(database, "rooms");
    onValue(roomsRef, (snap) => {
      console.log("Rooms ref:", snap.val());
      setAllRooms(snap.val());
    });
  });

  return (
    <RoomsContext.Provider value={allRooms}>{children}</RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
