import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
    IconButton,
    Spinner,
    FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItems";

const UpdateGroupChatModal = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();
    const { fetchMessages, fetchAgain, setFetchAgain } = props
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [imagePreview, setImagePreview] = useState();
    const [image, setImage] = useState();
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user/register?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };
    /* Image Uploading */
    const handleImage = async (e) => {
        const { name } = e.target;
        if (name === 'groupImage') {
            setImagePreview(URL.createObjectURL(e.target.files[0]));
            setImage(e.target.files[0]);
        }
    }

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            console.log(image, 9485)
            const { data } = await axios.put(
                `/api/chat/renamegroup`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                    image,
                },
                config
            );
            console.log(data, 93580)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            setSearchResult([])
            onClose()
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/addgroup`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/removegroup`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >
                        Edit Group
                    </ModalHeader>

                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <div
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' }}
                        >
                            <FormLabel htmlFor="ImageUpload">
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={imagePreview ? imagePreview : selectedChat.groupImage}
                                        alt="Avatar Preview"
                                        className="img-fluid"
                                        style={{
                                            width: '100px',
                                            borderRadius: '50%',
                                            height: '100px',
                                            border: '1px solid #dbdbdb',
                                            objectFit: 'contain',
                                        }}
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src = 'https://img.favpng.com/2/12/12/computer-icons-portable-network-graphics-user-profile-avatar-png-favpng-L1ihcbxsHbnBKBvjjfBMFGbb7.jpg';
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            bottom: '5px',
                                            right: '5px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '25px',
                                                height: '25px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                color: 'white',
                                                alignItems: 'center',
                                                background: '#6ab04c ',
                                            }}
                                        > +
                                            {/* <Iconify icon="eva:plus-fill" /> */}
                                        </div>
                                    </span>
                                </div>
                            </FormLabel>
                            <input
                                type="file"
                                name="groupImage"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="ImageUpload"
                                onChange={(e) => handleImage(e)}
                            />
                        </div>
                        <FormControl d="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName ? groupChatName : selectedChat.chatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />

                        </FormControl>

                        <Button
                            variant="solid"
                            colorScheme="teal"
                            ml={1}
                            mb={2}
                            isLoading={renameloading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>

                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
