// useGlobalContext.ts
import { useContext } from "react";
import GlobalContext from "./GlobalContext";

const useGlobalContext = () => {
    const ctx = useContext(GlobalContext);
    if (!ctx) throw new Error("useGlobalContext must be used within GlobalProvider");
    return ctx;
};

export default useGlobalContext;