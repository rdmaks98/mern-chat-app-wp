import { useState } from 'react'
import { Box, Flex, Square } from "@chakra-ui/layout";
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { ChatState } from '../Context/ChatProvider';
import ChatBox from '../components/ChatBox';
import MyChat from '../components/MyChat';
const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();


    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Flex>

                <Square style={{ display: "block" }} >
                    {user && <MyChat fetchAgain={fetchAgain} />}
                </Square>
                <Box flex='1' p={3}>
                    {user && (
                        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    )}
                </Box>
            </Flex>

        </div >
    )
}

export default ChatPage