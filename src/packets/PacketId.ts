enum PacketId {
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
    ServerJoinGameFailed,
    ServerUserJoinedGame,
    ServerUserLeftGame,
    ClientChangeGameMap,
    ServerGameMapChanged,
    ClientGamePlayerNoMap,
    ServerGamePlayerNoMap,
    ClientGamePlayerHasMap,
    ServerGamePlayerHasMap,
    ServerGameStart,
    ClientPlayerFinished,
    ServerGameEnded,
    ClientGameJudgements,
    ServerGameJudgements,
    ClientGameScreenLoaded,
    ServerAllPlayersLoaded,
    ClientGameSongSkipRequest,
    ServerGameAllPlayersSkipped,
    ClientGamePlayerReady,
    ServerGamePlayerReady,
    ClientGamePlayerNotReady,
    ServerGamePlayerNotReady,
    ClientGameStartCountdown,
    ServerGameStartCountdown,
    ClientGameStopCountdown,
    ServerGameStopCountdown,
    ServerGameDifficultyRangeChanged,
    ServerGameMaxSongLengthChanged,
    ServerGameAllowedModesChanged,
    ClientGameChangeModifiers,
    ServerGameChangeModifiers,
    ServerGameFreeModTypeChanged,
    ClientGamePlayerChangeModifiers,
    ServerGamePlayerChangeModifiers,
    ServerGameKicked,
    ServerGameNameChanged,
    ServerGameInvite,
    ClientGameAcceptInvite,
    ServerGameHealthTypeChanged,
    ServerGameLivesChanged,
    ServerGameHostRotationChanged,
    ServerGamePlayerTeamChanged,
    ClientGamePlayerTeamChanged,
    ServerGameRulesetChanged,
    ServerGameLongNotePercentageChanged
}

export default PacketId;
