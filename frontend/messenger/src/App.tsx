import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./layouts/RegistrationAndLogin/Login/Login";
import { Register } from "./layouts/RegistrationAndLogin/Registration/Register";
import { HomePage } from "./layouts/HomePage/HomePage";
import { ConversationProvider } from "./contexts/ConversationContext";
import { ConversationParticipantsProvider } from "./contexts/ConversationParticipantContext";

export const App = () => {
  return (
    <>
      <ConversationParticipantsProvider>
        <ConversationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </ConversationProvider>
      </ConversationParticipantsProvider>
    </>
  )
}