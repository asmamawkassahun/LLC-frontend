const ChatIcon = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button className="w-14 h-14 bg-purple hover:bg-purple-dark rounded-full flex items-center justify-center shadow-lg transition-colors">
                <div className="flex flex-col gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
            </button>
        </div>
    );
};

export default ChatIcon;

