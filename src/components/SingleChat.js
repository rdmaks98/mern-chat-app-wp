import React, { useState, useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Text, Box } from "@chakra-ui/layout"
import { IconButton, Spinner, useToast, InputLeftElement, InputGroup, Input } from "@chakra-ui/react"
import { ArrowBackIcon, LinkIcon } from "@chakra-ui/icons";
import { FormControl } from "@chakra-ui/form-control";
import InputEmoji from "react-input-emoji";
import socketIO from 'socket.io-client';
import {
    getSender, getSenderFull
} from '../config/ChatLogics';
import axios from "axios";
import ProfileModal from './miscellaneous/ProfileModel';
import Lottie from 'react-lottie';
import ScrollableChat from "./ScrollableChat"
import "./styles.css";
import animationData from "../animations/typing.json";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
const ENDPOINT = "http://localhost:2570";
const socket = socketIO.connect(ENDPOINT);

var selectedChatCompare;
const SingleChat = (props) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();
    const [isUpload, setIsUpload] = useState()
    const [isImage, setIsImage] = useState();
    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
    const { fetchAgain, setFetchAgain } = props
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const doHandleUpload = async (e) => {
        const { name } = e.target;
        if (name === 'uploadfile') {
            setIsUpload(URL.createObjectURL(e.target.files[0]));
            setIsImage(e.target.files[0]);
        }
        console.group("add group")
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    const sendMessage = async (event) => {
        if ((event.key === "Enter" && newMessage) || (isImage)) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const formData = new FormData();
                formData.append('content', newMessage)
                formData.append('chatId', selectedChat._id)
                formData.append('image', isImage)
                const { data } = await axios.post(
                    "/api/message",
                    formData,
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    function handleOnEnter(text) {
        console.log('enter', text)
        setNewMessage(text);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }
    useEffect(() => {
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });
    console.log(messages.uploadfile, "34058")
    return (
        <>
            {
                selectedChat ? (
                    <>

                        <Text style={{ display: "flex" }} fontSize={{ base: "28px", md: "30px" }}
                            // pb={5}
                            px={4}
                            fontFamily="Work sans"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center">
                            <IconButton
                                d={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {messages &&
                                (!selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal
                                            user={getSenderFull(user, selectedChat.users)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchMessages={fetchMessages}
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />
                                    </>
                                ))}
                        </Text>

                        <Box
                            d="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : (
                                <>
                                    <div className="messages">
                                        <ScrollableChat messages={messages} />
                                    </div>
                                    {!messages.isImage && isUpload ? <span><img src={isUpload} alt="message" height="auto" maxWidth="40%" /></span> : ""}
                                </>

                            )}

                            <FormControl
                                onKeyDown={sendMessage}
                                id="first-name"
                                isRequired
                                mt={2}
                                mb={0}
                            >
                                {istyping ? (
                                    <div>
                                        <Lottie
                                            options={defaultOptions}
                                            // height={50}
                                            width={70}
                                            style={{ marginBottom: 15, marginLeft: 0 }}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}


                                <Text style={{ display: "flex" }} fontSize={{ base: "28px", md: "30px" }}
                                    // pb={5}
                                    px={4}
                                    fontFamily="Work sans"
                                    justifyContent={{ base: "space-between" }}
                                    alignItems="center">

                                    <InputEmoji
                                        value={newMessage}
                                        onChange={setNewMessage}
                                        cleanOnEnter
                                        onEnter={handleOnEnter}
                                        placeholder="Type a message .........."
                                    />
                                    <InputGroup>
                                        <InputLeftElement
                                            className="InputLeft"
                                            children={<LinkIcon className="SearchIcon" color="gray.300" />}
                                            size="xs"
                                        />
                                        <Input type="file" name="uploadfile" accept="image/*" onChange={(e) => doHandleUpload(e)} className="Input" variant="outline" size="xs" />
                                    </InputGroup>
                                </Text>
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat