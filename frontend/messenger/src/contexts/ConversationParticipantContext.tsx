import React, { createContext, useState, useContext } from "react";
import { ConversationParticipantDTO } from "../types/ConversationParticipantDTO";

interface ConversationParticipantsContextProps {
    participants: ConversationParticipantDTO[] | null,
    setParticipants: (participants: ConversationParticipantDTO[]) => void;
}

const ConversationParticipantContext = createContext<ConversationParticipantsContextProps>({
    participants: null,
    setParticipants: () => { },
})

export const useParticipants = () => useContext(ConversationParticipantContext);

interface ConversationParticipantsProps {
    children: React.ReactNode;
}

export const ConversationParticipantsProvider: React.FC<ConversationParticipantsProps> = ({ children }) => {
    const [participants, setParticipants] = useState<ConversationParticipantDTO[] | null>(null);

    return (
        <ConversationParticipantContext.Provider value={{ participants, setParticipants }}>
            {children}
        </ConversationParticipantContext.Provider>
    )
}