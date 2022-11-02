import User from "../../handlers/rooster/User";

interface ISocketTokenToUserMap {
    [token: string]: User
}

export default ISocketTokenToUserMap;