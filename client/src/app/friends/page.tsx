import FriendsHeading from "./components/friendsHeading"
import Requests from "./components/requests"
import FriendsList from "./components/friendsList"
export default function Friends(){
    return(
        <div>
            <FriendsHeading />
            <Requests />
            <FriendsList />
        </div>
    )
}