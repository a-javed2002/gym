import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

import { FaSearch, FaCamera, FaPaperclip, FaSmile, FaMicrophone } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { useSelector, useDispatch } from 'react-redux';

function Chat() {
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('contacts'); // Tabs state
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(true);
    const [AddMemberModal, setAddMemberModal] = useState(false);
    //audio
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    //delete
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [Status, setStatus] = useState('');
    const UserRole = useSelector((state) => state.auth.user);
    const loginid = useSelector((state) => state.auth.user.id);
    useEffect(() => {
        async function fetchData() {
            try {
                let contactsResponse;

                if (UserRole.role === 'Admin') {
                    contactsResponse = await axios.get('http://localhost:8000/api/Contact');
                } else if (UserRole.role === 'Trainer') {
                    contactsResponse = await axios.get(`http://localhost:8000/api/TrainerContact/${loginid}`);
                } else if (UserRole.role === 'User') {
                    contactsResponse = await axios.get(`http://localhost:8000/api/UserContact/${loginid}`);
                }

                const groupsResponse = await axios.get('http://localhost:8000/api/groups');

                // Ensure contactsResponse.data is an array
                setContacts(Array.isArray(contactsResponse?.data) ? contactsResponse.data : []);
                setGroups(Array.isArray(groupsResponse?.data) ? groupsResponse.data : []);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }

        if (UserRole && loginid) {
            fetchData();
        }
    }, [UserRole, loginid]);






    const rid1 = useSelector((state) => state.auth.user)
    const selectChat = async (id, type) => {
        setCurrentChat({ id, type });


        const loggedInUserId = rid1.id;
        if (!loggedInUserId) {
            console.log('Logged in user ID is not available');
            return;
        }

        try {
            const endpoint = type === 'group'
                ? `http://localhost:8000/api/chat/messages/group/${id}`
                : `http://localhost:8000/api/chat/messages/direct/${loggedInUserId}/${id}`;

            const messagesResponse = await axios.get(endpoint);
            setMessages(messagesResponse.data || []);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };
    const rid4 = useSelector((state) => state.auth.user)
    const sendMessage = async () => {

        const loggedInUserId = rid4.id;

        if (!currentChat) {
            alert('chat is not selected')
            return;
        }
        if (!newMessage.trim() && selectedFiles.length === 0 && !audioBlob) {
            return; // No message, files, or audio to send
        }

        const formData = new FormData();
        formData.append('sender', loggedInUserId);
        formData.append('text', newMessage);
        if (currentChat.type === 'group') {
            formData.append('group', currentChat.id);
        } else {
            formData.append('receiver', currentChat.id);
        }

        // Append each file to the FormData object
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('attachments', selectedFiles[i]);
        }
        // Add recorded audio blob
        if (audioBlob) {
            formData.append('attachments', audioBlob, 'voice_note.ogg');
        }
        try {
            await axios.post('http://localhost:8000/api/send', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setNewMessage('');
            setSelectedFiles([]);
            setAudioBlob(null);

            // Fetch updated messages
            const messagesResponse = await axios.get(currentChat.type === 'group'
                ? `http://localhost:8000/api/chat/messages/group/${currentChat.id}`
                : `http://localhost:8000/api/chat/messages/direct/${loggedInUserId}/${currentChat.id}`
            );
            setMessages(messagesResponse.data || []);
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const handleSelectContact = (contactId) => {
        setSelectedMembers(prevSelected =>
            prevSelected.includes(contactId)
                ? prevSelected.filter(id => id !== contactId)
                : [...prevSelected, contactId]
        );
    };

    const openGroupModal = () => {
        setShowModal(true);
    };
    const [groupsmember, setgroupsmember] = useState([]);
    const openAddMemberModal = async (id, type) => {

        const loginid = rid1.id; // Get the logged-in user ID

        if (!id || !loginid) {
            console.log('Group ID or logged-in user ID is not available');
            return;
        }
    
        try {
            const memberdata = `http://localhost:8000/api/member/${id}/${loginid}`; // Use both group ID and login ID in the URL
    

            const messagesResponse = await axios.get(memberdata);
            setgroupsmember(messagesResponse.data || []);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
        setAddMemberModal(true);
    };
    const rid3 = useSelector((state) => state.auth.user)
    const createGroup = async () => {
        if (!newGroupName.trim()) {
            alert('Group name cannot be empty.');
            return;
        }
        if (selectedMembers.length < 1) {
            alert('Please select at least one member to create a group.');
            return;
        }

        try {

            const loggedInUserId = rid3.id;
            await axios.post('http://localhost:8000/api/group', {
                name: newGroupName,
                members: [...selectedMembers, loggedInUserId]
            });
            setNewGroupName('');
            setSelectedMembers([]);
            setShowModal(false);
            const groupsResponse = await axios.get('http://localhost:8000/api/groups');
            setGroups(groupsResponse.data || []);
        } catch (error) {
            console.error("Error creating group", error);
        }
    };
    const addmember = async () => {
        if (!newGroupName.trim()) {
            alert('Group name cannot be empty.');
            return;
        }
        if (selectedMembers.length < 1) {
            alert('Please select at least one member to create a group.');
            return;
        }

        try {

            const loggedInUserId = rid3.id;
            await axios.post('http://localhost:8000/api/group', {
                name: newGroupName,
                members: [...selectedMembers, loggedInUserId]
            });
            setNewGroupName('');
            setSelectedMembers([]);
            setShowModal(false);
            const groupsResponse = await axios.get('http://localhost:8000/api/groups');
            setGroups(groupsResponse.data || []);
        } catch (error) {
            console.error("Error creating group", error);
        }
    };
    const filteredContacts = contacts.filter(contact =>
        contact.User_Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const rid2 = useSelector((state) => state.auth.user)
    // Filter groups to show only those that the logged-in user is a member of
    const loggedInUserId = rid2.id;
    const userGroups = groups.filter(group =>
        group.members.includes(loggedInUserId)
    );
    const handleEmojiSelect = (event, emojiObject) => {
        console.log('Selected emoji object:', emojiObject); // Log the entire emojiObject
        if (emojiObject && emojiObject.emoji) {
            setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
            setShowEmojiPicker(false); // Hide emoji picker after selection
        } else {
            console.error('Emoji object is undefined or does not contain the emoji property.');
        }
    };
    const startRecording = () => {
        setIsRecording(true);
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);
                recorder.start();

                recorder.ondataavailable = (event) => {
                    setAudioBlob(event.data);
                };

                recorder.onstop = () => {
                    setIsRecording(false);
                };
            })
            .catch(error => {
                console.error("Error accessing microphone", error);
            });
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };
    //delete
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdownClick = () => {
        setShowDropdown(!showDropdown);
    };



    const handleDropdownOptionClick = async (action) => {
        if (!currentChat) {
            return;
        }

        try {
            if (action === 'delete-chat') {
                // Delete the current chat
                await deleteChat(currentChat.id, currentChat.type);
            } else if (action === 'delete-selected-chat') {
                // Delete selected chats
                await deleteMessages();
            }
        } catch (error) {
            console.error('Error handling dropdown action:', error);
        }

        // Reset the dropdown
        setShowDropdown(false);
    };

    const handleSelectMessage = (messageId) => {
        setSelectedMessages(prevSelected =>
            prevSelected.includes(messageId)
                ? prevSelected.filter(id => id !== messageId)
                : [...prevSelected, messageId]
        );
    };
    const deleteMessages = async () => {
        try {
            await axios.post('http://localhost:8000/api/delete/messages', { messageIds: selectedMessages });
            setSelectedMessages([]);
            // Fetch updated messages
            selectChat(currentChat.id, currentChat.type);
        } catch (error) {
            console.error("Error deleting messages", error);
        }
    };

    const deleteChat = async () => {
        try {
            await axios.post(`http://localhost:8000/api/delete/chat/${currentChat.id}`, { type: currentChat.type });
            setCurrentChat(null);
            setMessages([]);
            // Optionally, refresh contacts and groups if needed
        } catch (error) {
            console.error("Error deleting chat", error);
        }
    };

    const style = `
    .active-status {
display:none;
    }
   
  `;
    const roles = useSelector((state) => state.auth.user)
    var dataofrole = roles.role
    const getStatusClass = () => {
        return dataofrole === 'User' ? 'active-status' : 'disabled-status';
    };
    return (
        <div className="main-body">
            <div id="app" className='row'>
                <div id="sidebar2" className='col-4'>
                    <div className="tab-buttons">
                        <button
                            className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('contacts')}
                        >
                            <i className="bi bi-person"></i> Contacts
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`}
                            onClick={() => setActiveTab('groups')}
                        >
                            <i className="bi bi-people"></i> Groups
                        </button>
                    </div>

                    <div className="input-group mb-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="form-control"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="input-group-text"><FaSearch className="search-icon" /></span>
                    </div>

                    {activeTab === 'contacts' && (
                        <>
                            <h2>Contacts</h2>
                            <ul id="contacts">
                                {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                                    <li
                                        key={contact._id}
                                        onClick={() => selectChat(contact._id, 'contact')}
                                        className={currentChat?.id === contact._id ? 'selected' : ''}
                                    >
                                        <img src={'https://photosly.net/wp-content/uploads/2023/12/no-dp32.jpg'} alt={`${contact.User_Name}'s profile`} className="contact-avatar" />
                                        <span className="contact-name">{contact.User_Name}</span>
                                    </li>
                                )) : <li>No contacts available</li>}
                            </ul>
                        </>
                    )}

                    {activeTab === 'groups' && (
                        <>
                            <div className='d-flex justify-content-between'>
                                <React.Fragment>
                                    <style>{style}</style>


                                    <button onClick={openGroupModal} className={`btn btn-primary ${getStatusClass()}`} id="create-group-button">Create Group</button>
                                </React.Fragment>
                            </div>
                            <h2>Groups</h2>
                            <ul id="groups">
                            {/* onClick={() => selectChat(group._id, 'group')}    */}
                                {userGroups.length > 0 ? userGroups.map(group => (
                                    <li key={group._id}   onClick={() => selectChat(group._id, 'group')}     onDoubleClick={() => openAddMemberModal(group._id)}>
                                        {group.name}
                                    </li>
                                )) : <li>No groups available</li>}
                            </ul>
                        </>
                    )}
                </div>
                <div className='chat col-8 p-0'>

                    <div id="chat-header" className='d-flex justify-content-between align-items-center p-3 border-bottom'>
                        <div id="chat-title">
                            <h2 className="mb-0">
                                {currentChat
                                    ? (currentChat.type === 'group'
                                        ? `Group: ${userGroups.find(g => g._id === currentChat.id)?.name || 'Unknown Group'}`
                                        : contacts.find(c => c._id === currentChat.id)?.User_Name || 'Unknown Contact')
                                    : 'Select a contact or group'}
                            </h2>
                        </div>
                        <div className="btn-group dropstart">
                            <button
                                type="button"
                                className="btn btn-secondary dropdown-toggle"
                                onClick={handleDropdownClick}
                                style={{ backgroundColor: '#7571f9', border: 'none' }}
                            >
                                <i className="fas fa-ellipsis-v" style={{ fontSize: '24px', color: '#fff' }}></i>
                            </button>
                            {showDropdown && (
                                <ul className="dropdown-menu show" style={{ marginLeft: '-130px' }} aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <button className="dropdown-item" onClick={() => handleDropdownOptionClick('delete-chat')}>
                                            Delete Chat
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={() => handleDropdownOptionClick('delete-selected-chat')}>
                                            Delete Selected Chat
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>


                    <div id="chat-body">
                        <div id="messages">
                            {messages.length > 0 ? messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.sender._id === localStorage.getItem('id') ? 'sent' : 'received'} ${selectedMessages.includes(msg._id) ? 'selected' : ''}`}
                                    onDoubleClick={() => handleSelectMessage(msg._id)}
                                >
                                    <div className="message-header">
                                        {msg.sender.User_Name}
                                        <span className="message-time">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="message-text">
                                        {msg.text && <p className="text-start">{msg.text}</p>}

                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="message-attachments">
                                                {msg.attachments.map((attachment, idx) => {
                                                    const isAudio = attachment.filename.endsWith('.ogg') || attachment.filename.endsWith('.mp3') || attachment.filename.endsWith('.wav');
                                                    return (
                                                        <div key={idx} className="attachment-wrapper">
                                                            {isAudio ? (
                                                                <audio controls className="d-block mb-2">
                                                                    <source src={`http://localhost:8000/${attachment.url}`} type="audio/ogg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            ) : (
                                                                <img
                                                                    src={`http://localhost:8000/${attachment.url}`}
                                                                    alt={attachment.filename}
                                                                    className="message-image d-block mb-2"
                                                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : <div>No messages</div>}
                        </div>


                        <div id="" className='mb-5 w-100 chat-bottom '>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="file-input"
                                id="file-input"
                                style={{ display: 'none' }} // Hide the file input
                            />

                            {/* Camera icon for attachment */}
                            <FaPaperclip
                                className="attach-icon"
                                onClick={() => document.getElementById('file-input').click()} // Trigger file input click
                                style={{ cursor: 'pointer', fontSize: '24px', marginRight: '10px', color: '#54656f' }} // Styling for icon
                            />
                            {/* Emoji Picker */}

                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                id="message-input"
                            />

                            {/* Voice note recorder */}
                            {isRecording ? (


                                <FaMicrophone
                                    className="microphone-icon"
                                    onClick={stopRecording}
                                    style={{ cursor: 'pointer', fontSize: '24px', color: '#ff4e44' }}
                                />
                            ) : (
                                <FaMicrophone
                                    className="microphone-icon"
                                    onClick={startRecording}
                                    style={{ cursor: 'pointer', fontSize: '24px', color: '#54656f' }}
                                />
                            )}
                            <button onClick={sendMessage} id="send-button">Send</button>

                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for Group Creation */}
            {showModal && (
                <div id="group-modal">
                    <div className="modal-content">
                        <h2>Create a New Group</h2>
                        <input
                            type="text"
                            value={newGroupName}
                            className='form-control'
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="Group Name"
                        />
                        <h3>Select Members</h3>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search contacts..."
                            className="form-control mb-2"
                        />
                        <ul id="modal-contacts">
                            {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                                <li
                                    key={contact._id}
                                    onClick={() => handleSelectContact(contact._id)}
                                    className={selectedMembers.includes(contact._id) ? 'selected' : ''}
                                >
                                    {contact.User_Name}
                                </li>
                            )) : <li>No contacts found</li>}
                        </ul>
                        <div className='d-flex justify-content-center'>

                            <button onClick={createGroup} className={`btn  mb-2 `} style={{ backgroundColor: '#7571f9' }}>Create Group</button>
                            <button onClick={() => setShowModal(false)} className="btn mb-2" style={{ backgroundColor: '#7571f9' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
   {AddMemberModal && (
                <div id="group-modal">
                    <div className="modal-content">
                        <h2>Select a New Member</h2>

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search contacts..."
                            className="form-control mb-2"
                        />

                        <ul id="modal-contacts">
                            {groupsmember.length > 0 ? groupsmember
                                .filter(a => a.User_Name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(a => (
                                    <li
                                        key={a._id}
                                        onClick={() => handleSelectContact(a._id)}
                                        className={selectedMembers.includes(a._id) ? 'selected' : ''}
                                    >
                                        {a.User_Name}
                                    </li>
                                )) : <li>No contacts found</li>}
                        </ul>

                        <div className='d-flex justify-content-center'>
                            <button onClick={createGroup} className="btn mb-2" style={{ backgroundColor: '#7571f9' }}>Create Group</button>
                            <button onClick={() => setAddMemberModal(false)} className="btn mb-2" style={{ backgroundColor: '#7571f9' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
