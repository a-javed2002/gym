import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';

function TestEmojiPicker() {
    const [text, setText] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // Simulating an asynchronous initialization
    const initialize = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('Initialization complete');
            }, 1000); // Simulate a 1-second delay
        });
    };

    useEffect(() => {
        // Use an IIFE (Immediately Invoked Function Expression) to handle async operations in useEffect
        (async () => {
            try {
                const result = await initialize();
                console.log(result); // Log initialization result
                setIsInitialized(true);
            } catch (error) {
                console.error('Initialization failed:', error);
            }
        })();
    }, []);

    const handleEmojiSelect = (event, emojiObject) => {
        console.log('Selected emoji object:', emojiObject);
        if (emojiObject && emojiObject.emoji) {
            setText(prevText => prevText + emojiObject.emoji); // Append the emoji to the text
        } else {
            console.error('Emoji object is undefined or does not contain the emoji property.');
        }
    };

    return (
        <div className='content-body'>
            {!isInitialized ? (
                <p>Loading...</p>
            ) : (
                <>
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your message..."
                        rows="4"
                        cols="50"
                    />
                </>
            )}
        </div>
    );
}

export default TestEmojiPicker;
