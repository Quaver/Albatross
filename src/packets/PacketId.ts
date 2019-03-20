enum PacketId {
    /// <summary>
    ///     Just an invalid packet as a placeholder since enums default at 0.
    /// </summary>
    Invalid = 0,
    ServerPing,
    ClientPong,
    ServerLoginReply,
    ServerUserDisconnected,
    ServerUserConnected,
    ServerAvailableChatChannel,
    ServerJoinedChatChannel,
    ServerChatMessage,
    ClientChatMessage,
    ClientRequestLeaveChatChannel,
    ServerLeftChatChannelPacket,
    ClientRequestJoinChatChannel,
    ServerFailedToJoinChannelPacket,
    ServerMuteEndTimePacket,
    ServerNotification,
    ClientStatusUpdate,
    ServerUsersOnline,
    ClientRequestUserInfo,
    ServerUserInfo,
    ClientRequestUserStatus,
    ServerUserStatus,
    ServerFailedToLogin,
    ServerChooseUsername,
    ClientLobbyJoin,
    ClientLobbyLeave,
    ClientCreateGame,
    ServerMultiplayerGameInfo,
    ServerJoinGame,
    ServerChangeGameHost,
    ClientLeaveGame,
    ServerGameDisbanded,
    ClientJoinGame,
    ServerJoinGameFailed
}

export default PacketId;