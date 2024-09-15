import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';
import { FaSearch } from 'react-icons/fa';

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
    const [activeTab, setActiveTab] = useState('contacts'); // New state for tabs

    useEffect(() => {
        async function fetchData() {
            try {
                const contactsResponse = await axios.get('http://localhost:8000/api/Contact');
                const groupsResponse = await axios.get('http://localhost:8000/api/groups');
                setContacts(contactsResponse.data || []);
                setGroups(groupsResponse.data || []);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        fetchData();
    }, []);

    const selectChat = async (id, type) => {
        setCurrentChat({ id, type });
        const loggedInUserId = localStorage.getItem('id');
        if (!loggedInUserId) {
            console.log('Logged in user ID is not available');
            return;
        }
    
        try {
            let endpoint;
            if (type === 'group') {
                endpoint = `http://localhost:8000/api/chat/messages/group/${id}`;
            } else {
                endpoint = `http://localhost:8000/api/chat/messages/direct/${loggedInUserId}/${id}`;
            }
            const messagesResponse = await axios.get(endpoint);
            setMessages(messagesResponse.data || []);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };
    
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };
    
    const sendMessage = async () => {
        for (let i = 0; i < selectedFiles.length; i++) {
            .append('attachments', selectedFiles[i]);
        }
        if (newMessage.trim()) {
            const loggedInUserId = localStorage.getItem('id');
            try {
                await axios.post('http://localhost:8000/api/send', {
                    sender: loggedInUserId,
                    text: newMessage,
                    ...(currentChat.type === 'group' ? { group: currentChat.id } : { receiver: currentChat.id })
                });
                setNewMessage('');
                const messagesResponse = await axios.get(`http://localhost:8000/api/chat/messages/direct/${loggedInUserId}/${currentChat.id}`);
                setMessages(messagesResponse.data || []);
            } catch (error) {
                console.error("Error sending message", error);
            }
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
            const loggedInUserId = localStorage.getItem('id');
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

    // Filter groups to show only those that the logged-in user is a member of
    const loggedInUserId = localStorage.getItem('id');
    const userGroups = groups.filter(group =>
        group.members.includes(loggedInUserId)
    );
    const [cssExists, setCssExists] = useState(true);

    // Effect to check if the CSS rule is present
    useEffect(() => {
        const styleSheets = Array.from(document.styleSheets);
        const cssFound = styleSheets.some(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || []);
                return rules.some(rule => rule.selectorText === '.chat-icon' && rule.style.display === 'none');
            } catch (e) {
                return false;
            }
        });
        setCssExists(cssFound);
    }, []);


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
                            <button onClick={openGroupModal} className='btn btn-primary' id="create-group-button">Create Group</button>
                            <h2>Groups</h2>
                            <ul id="groups">
                                {userGroups.length > 0 ? userGroups.map(group => (
                                    <li key={group._id} onClick={() => selectChat(group._id, 'group')}>
                                        {group.name}
                                    </li>
                                )) : <li>No groups available</li>}
                            </ul>
                        </>
                    )}
                </div>
                <div className='chat col-8'>
                    <div id="chat-header">
                        <h2 id="chat-title">
                            {currentChat
                                ? (currentChat.type === 'group'
                                    ? `Group: ${userGroups.find(g => g._id === currentChat.id)?.name || 'Unknown Group'}`
                                    : contacts.find(c => c._id === currentChat.id)?.User_Name || 'Unknown Contact')
                                : 'Select a contact or group'}
                        </h2>
                    </div>
                    <div id="chat-body">
                        <div id="messages">
                            {messages.length > 0 ? messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender._id === localStorage.getItem('id') ? 'sent' : 'received'}`}>
                                    <div className="message-header">
                                        {msg.sender.User_Name}
                                        <span className="message-time">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="message-text">
                                        {msg.text}
                                    </div>
                                </div>
                            )) : <div>No messages</div>}
                        </div>
                        <div id="chat-footer">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                id="message-input"
                            />
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
                        <ul id="modal-contacts">
                            {contacts.map(contact => (
                                <li
                                    key={contact._id}
                                    onClick={() => handleSelectContact(contact._id)}
                                    className={selectedMembers.includes(contact._id) ? 'selected' : ''}
                                >
                                    {contact.User_Name}
                                </li>
                            ))}
                        </ul>
                        <div className='d-flex justify-content-center'>
                            <button onClick={createGroup} className="btn mb-2" style={{ backgroundColor: '#7571f9' }}>Create Group</button>
                            <button onClick={() => setShowModal(false)} className="btn mb-2" style={{ backgroundColor: '#7571f9' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
