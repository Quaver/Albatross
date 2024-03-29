enum Privileges {
    Normal = 1 << 0,
    KickUsers = 1 << 1,
    BanUsers = 1 << 2,
    NotifyUsers = 1 << 3,
    MuteUsers = 1 << 4,
    RankMapsets = 1 << 5,
    ViewAdminLogs = 1 << 6,
    EditUsers = 1 << 7,
    ManageBuilds = 1 << 8,
    ManageAlphaKeys = 1 << 9,
    ManageMapsets = 1 << 10,
    EnableTournamentMode = 1 << 11
}

export default Privileges;