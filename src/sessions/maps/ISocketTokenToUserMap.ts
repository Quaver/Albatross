import User from "../User";

interface ISocketTokenToUserMap {
    [token: string]: User
}

export default ISocketTokenToUserMap;