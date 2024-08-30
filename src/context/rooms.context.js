import { off, onChildAdded, onValue, ref } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { database } from "../misc/firebase";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [allRooms, setAllRooms] = useState({});

  useEffect(() => {
    console.log("useEffect");
    let roomsRef = ref(database, "rooms");
    console.log("roomsRef:", roomsRef);
    onValue(
      roomsRef,
      (snapshot) => {
        console.log("handleValue");
        const data = snapshot.val();
        if (data) {
          setAllRooms((prevRooms) => ({
            ...prevRooms,
            [snapshot.key]: snapshot.val(),
          }));
        }
      },
      (err) => {
        console.log("Error in retreiving data:", err);
      }
    );

    onChildAdded(roomsRef, (snapshot) => {
      console.log("handleChildAdded");
      setAllRooms((prevRooms) => ({
        ...prevRooms,
        [snapshot.key]: snapshot.val(),
      }));
    });

    return () => {
      if (roomsRef) {
        off(roomsRef);
      }
    };
  }, []);

  return (
    <RoomsContext.Provider value={allRooms}>{children}</RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
