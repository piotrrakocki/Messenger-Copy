import React, { createContext, useState, useContext } from "react";
import { ConversationDTO } from "../types/ConversationDTO";

interface ConversationContextProps {
    conversation: ConversationDTO | null,
    setConversation: (conversation: ConversationDTO) => void;
}

const ConversationContext = createContext<ConversationContextProps>({
    conversation: null,
    setConversation: () => { },
})

export const useConversation = () => useContext(ConversationContext);

interface ConversationProviderProps {
    children: React.ReactNode;
}

export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children }) => {
    const [conversation, setConversation] = useState<ConversationDTO | null>(null);

    return (
        <ConversationContext.Provider value={{ conversation, setConversation }}>
            {children}
        </ConversationContext.Provider>
    )
}