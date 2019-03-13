enum PacketId {
    /// <summary>
    ///     Just an invalid packet as a placeholder since enums default at 0.
    /// </summary>
    Invalid = 0,

    /// <summary>
    ///     The server is pinging the client
    /// </summary>
    ServerPing,

    /// <summary>
    ///     The client responds with a pong packet.
    /// </summary>
    ClientPong,

    /// <summary>
    ///     When the server responds to a login request.
    /// </summary>
    ServerLoginReply,

    /// <summary>
    ///     When a user disconnects from the server.
    /// </summary>
    ServerUserDisconnected,

    /// <summary>
    ///     When a user connects to the server.
    /// </summary>
    ServerUserConnected,

    /// <summary>
    ///     The server sends the available chat channels for the user to join.
    /// </summary>
    ServerAvailableChatChannel,

    /// <summary>
    ///     The server tells the client that they've joined a chat channel.
    /// </summary>
    ServerJoinedChatChannel,

    /// <summary>
    ///     The server sends the client a chat message.
    /// </summary>
    ServerChatMessage,

    /// <summary>
    ///     The client sends a chat message packet from the server.
    /// </summary>
    ClientChatMessage,

    /// <summary>
    ///     The client requests to leave the chat channel.
    /// </summary>
    ClientRequestLeaveChatChannel,

    /// <summary>
    ///     The client tells the server that they have left a chat channel.
    /// </summary>
    ServerLeftChatChannelPacket,

    /// <summary>
    ///     The client requests to join a chat channel.
    /// </summary>
    ClientRequestJoinChatChannel,

    /// <summary>
    ///     The server tells the client that they've failed to join a chat channel.
    /// </summary>
    ServerFailedToJoinChannelPacket,

    /// <summary>
    ///     The server tells the client of a user's mute expiry.
    /// </summary>
    ServerMuteEndTimePacket,

    /// <summary>
    ///     The server wants to give the client a notification.
    /// </summary>
    ServerNotification,

    /// <summary>
    ///     The server is letting the client know what they're up to.
    /// </summary>
    ClientStatusUpdate,

    /// <summary>
    ///     The server is letting the client know about users that are already online.
    /// </summary>
    ServerUsersOnline,

    /// <summary>
    ///     The client is asking the server to provide them with info about users.
    /// </summary>
    ClientRequestUserInfo,

    /// <summary>
    ///     The server is giving the client user information.
    /// </summary>
    ServerUserInfo,

    /// <summary>
    ///     The client is asking the server to provide them with the client status for a list of users.
    /// </summary>
    ClientRequestUserStatus,

    /// <summary>
    ///     The server is giving the client updated user statuses
    /// </summary>
    ServerUserStatus,
    
    /// <summary>
    ///     The server is telling the client that they've failed to login
    /// </summary>
    ServerFailedToLogin,
    
    /// <summary>
    ///     The server is telling the client to choose a username
    /// </summary>
    ServerChooseUsername,

    ClientLobbyJoin,
    ClientLobbyLeave
}

export default PacketId;