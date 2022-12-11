const { createContext, useState, useContext } = require("react");

export const BrowserFrameContext = createContext();

export const Browser = () => {

    const [fullscreen, setFullscreen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [location, setLocation] = useState();
    const [status, setStatus] = useState(200);

    return {
        fullscreen,
        setFullscreen,
        loading,
        setLoading,
        location,
        setLocation,
        status,
        setStatus
    };
    
};


export const BrowserFrameProvider = ({ children }) => {
    const browser = Browser();
    return (
        <BrowserFrameContext.Provider value={browser}>
            {children}
        </BrowserFrameContext.Provider>
    );
};

const useBrowserFrame = () => {
    const browser = useContext(BrowserFrameContext);
    // Check if in a browser context
    if (!browser) {
        throw new Error(
            "useBrowserFrame must be used within a BrowserFrameProvider"
        );
    }
    return browser;
}

export default useBrowserFrame;