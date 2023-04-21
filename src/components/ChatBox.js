import "./styles.css";
import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
const ChatBox = (props) => {
    const { fetchAgain, setFetchAgain } = props
    const { selectedChat } = ChatState();
    return (
        <Box
            alignItems="center"
            ml={3}
            p={4}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox